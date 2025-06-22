Before you begin, ensure you have the following installed:

- Node.js
- Flutter
- Git
- Dart

## Installation

1. Clone the repository.
2. Install Server and Client dependencies using `npm run build`.
3. Access the Mobile Folder using `: cd mobile/`.
4. Install Mobile dependencies using `flutter pub get`.

## Environment Variables

To run this project, you need to set up the following environment variables:

1. Create a `.env` file in the directory of the project.
2. Add the environment variables in the format `KEY=VALUE`.

### Required Environment Variables

```plaintext
MONGO_URL=
PORT=
JWT_SECRET=
JWT_REFRESH_TOKEN=
NODE_ENV=
CLIENT_URL= 
REDIS_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
NODEMAILER_EMAIL=
NODEMAILER_PASS=
PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID=
PAYMOB_IFRAME_ID=
PAYMOB_HMAC_SECRET=
```

## Usage

1. Start the server using `npm run dev`.
2. Access the website folder using `cd client/`.
3. Start the website using `npm run dev`.
4. Access the Mobile Folder using `: cd mobile/`.
5. Start the website using `flutter run`.
