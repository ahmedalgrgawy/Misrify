import 'package:graduation_project1/models/products_model.dart';

List<Product> sortProductsBy(String sortType, List<Product> products) {
  List<Product> sorted = [...products];

  switch (sortType) {
    case 'Newest Arrivals':
      sorted.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      break;
    case 'Price: Highest to Lowest':
      sorted.sort((a, b) => b.price.compareTo(a.price));
      break;
    case 'Price: Lowest to Highest':
      sorted.sort((a, b) => a.price.compareTo(b.price));
      break;
    case 'Best Rated':
      // fallback: sort by number of reviews
      sorted.sort((a, b) => b.reviews.length.compareTo(a.reviews.length));
      break;
    default:
      break; // Most Popular fallback
  }

  return sorted;
}
