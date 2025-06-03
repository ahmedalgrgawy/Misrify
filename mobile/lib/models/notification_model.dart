class Notifications {
  final String id;
  final List<String> receivers;
  final String sender;
  final String content;
  final String type;
  final bool isRead;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int v;

  Notifications({
    required this.id,
    required this.receivers,
    required this.sender,
    required this.content,
    required this.type,
    required this.isRead,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Notifications.fromJson(Map<String, dynamic> json) {
    return Notifications(
      id: json['_id'],
      receivers: List<String>.from(json['receivers']),
      sender: json['sender'],
      content: json['content'],
      type: json['type'],
      isRead: json['isRead'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      v: json['__v'],
    );
  }
}
