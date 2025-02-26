import 'dart:convert';

ValidationErrorResponse validationErrorResponseFromJson(String str) =>
    ValidationErrorResponse.fromJson(json.decode(str));

String validationErrorResponseToJson(ValidationErrorResponse data) =>
    json.encode(data.toJson());

class ValidationErrorResponse {
  final bool success;
  final String message;
  final List<String>?
      errors; // ✅ Changed from Map<String, String> to List<String>

  ValidationErrorResponse({
    required this.success,
    required this.message,
    this.errors,
  });

  factory ValidationErrorResponse.fromJson(Map<String, dynamic> json) =>
      ValidationErrorResponse(
        success: json["success"],
        message: json["message"],
        errors: json["errors"] != null
            ? List<String>.from(json["errors"]) // ✅ Convert errors to a list
            : null,
      );

  Map<String, dynamic> toJson() => {
        "success": success,
        "message": message,
        "errors": errors,
      };
}
