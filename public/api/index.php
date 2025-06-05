<?php


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // TODO: Be more specific in production
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is accepted."]);
    exit();
}


$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);


if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON payload: " . json_last_error_msg()]);
    exit();
}


$requiredFields = ["Unit Name", "Arrival", "Departure", "Occupants", "Ages"];
$missingFields = [];
foreach ($requiredFields as $field) {
    if (empty($input[$field]) && $input[$field] !== 0 && $input[$field] !== '0') { // Allow 0 for numeric fields like age
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields: " . implode(", ", $missingFields)]);
    exit();
}

if (!is_numeric($input["Occupants"]) || (int)$input["Occupants"] <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Occupants must be a positive integer."]);
    exit();
}

if (!is_array($input["Ages"]) || count($input["Ages"]) != (int)$input["Occupants"]) {
    http_response_code(400);
    echo json_encode(["error" => "Ages array must exist and its count must match Occupants."]);
    exit();
}

foreach ($input["Ages"] as $age) {
    if (!is_numeric($age) || (int)$age < 0) {
        http_response_code(400);
        echo json_encode(["error" => "All ages must be non-negative integers."]);
        exit();
    }
}


$transformedPayload = [];

$transformedPayload["Unit Type ID"] = (int)$input["Unit Name"]; // 'Unit Name' from frontend maps to Unit Type ID


$arrivalDate = DateTime::createFromFormat('d/m/Y', $input["Arrival"]);
$departureDate = DateTime::createFromFormat('d/m/Y', $input["Departure"]);

if (!$arrivalDate || !$departureDate) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid date format. Use dd/mm/yyyy."]);
    exit();
}
if ($arrivalDate->format('d/m/Y') !== $input["Arrival"] || $departureDate->format('d/m/Y') !== $input["Departure"]){
    http_response_code(400);
    echo json_encode(["error" => "Invalid date values provided for Arrival or Departure."]);
    exit();
}

$transformedPayload["Arrival"] = $arrivalDate->format('Y-m-d');
$transformedPayload["Departure"] = $departureDate->format('Y-m-d');

// Guests: Based on Ages (Adult >= 18, Child < 18)
$guests = [];
$adultAgeThreshold = 18;
foreach ($input["Ages"] as $age) {
    $guests[] = ["Age Group" => (int)$age >= $adultAgeThreshold ? "Adult" : "Child"];
}
$transformedPayload["Guests"] = $guests;


$externalApiUrl = 'https://dev.gondwana-collection.com/Web-Store/Rates/Rates.php';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $externalApiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($transformedPayload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen(json_encode($transformedPayload))
]);

// For local development with potential SSL cert issues with the external API:
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30); // 30 seconds timeout

$externalApiResponse = curl_exec($ch);
$httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to call external API: " . $curlError, "transformedPayloadSent" => $transformedPayload]);
    exit();
}

$decodedExternalResponse = json_decode($externalApiResponse, true);

if ($httpStatusCode >= 400) {
    http_response_code(502);
    echo json_encode([
        "error" => "External API returned an error.",
        "external_status_code" => $httpStatusCode,
        "external_response" => $decodedExternalResponse ?: $externalApiResponse, // Show decoded response, or raw if decoding failed
        "transformedPayloadSent" => $transformedPayload
    ]);
    exit();
}

// Relay response to frontend
$finalResponse = [
    'unitNameUsed' => $input["Unit Name"],
    'requestedArrival' => $input["Arrival"],
    'requestedDeparture' => $input["Departure"],
    'ratesData' => $decodedExternalResponse
];

http_response_code($httpStatusCode);
echo json_encode($finalResponse);

?>
