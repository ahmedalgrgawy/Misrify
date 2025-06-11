import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:graduation_project1/models/api_error_model.dart';
import 'package:graduation_project1/models/hook_result.dart';

FetchHook useGenericFetch<T>({
  required Future<List<T>> Function() onFetch,
}) {
  final data = useState<List<T>?>(null);
  final isLoading = useState<bool>(false);
  final error = useState<Exception?>(null);
  final apiError = useState<ApiError?>(null);
  final isMounted = useIsMounted(); // ✅

  Future<void> fetchData() async {
    if (!isMounted()) return; // early exit if widget is gone
    isLoading.value = true;
    try {
      final result = await onFetch();
      if (isMounted()) data.value = result;
    } catch (e) {
      if (e is ApiError && isMounted()) {
        apiError.value = e;
      }
    } finally {
      if (isMounted()) isLoading.value = false;
    }
  }

  useEffect(() {
    fetchData();
    return null;
  }, []);

  return FetchHook(
    data: data.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: fetchData,
  );
}
