import 'package:flutter/material.dart';
import 'package:graduation_project1/models/api_error_model.dart';

class FetchHook {
  final dynamic data;
  final bool isLoading;
  final Exception? error;
  final Future<void> Function()? refetch;

  FetchHook({
    required this.data,
    required this.isLoading,
    required this.error,
    required this.refetch,
    ApiError? apiError,
  });
}
