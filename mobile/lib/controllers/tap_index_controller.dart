import 'package:get/get.dart';

class TapIndexController extends GetxController {
  final RxInt _tapIndex = 0.obs;

  int get tapIndex => _tapIndex.value;
  set setTapIndex(int newValue) {
    _tapIndex.value = newValue;
  }
}
