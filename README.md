
# Cafeteria

Cafeteria is a coffee lover's companion app designed to enhance the coffee experience. Users can browse different types of coffee, create personalized journal entries, and manage their profiles and carts. This app includes features for logging in, viewing products, tracking orders, and managing a coffee journal.

## Team Members
- XI XI
- YIXIANG ZHOU

## Video Link
- **Literal 1**: https://www.youtube.com/watch?v=1dv-jXugL6c&t=98s
- **Literal 2**: https://www.youtube.com/watch?v=7Z2wkOLXP_o&t=4s
- **Literal 3**: https://www.youtube.com/watch?v=f7naqxG8CHc&ab_channel=Ra%C3%BAlAchilles
 
## Features
1. **Authentication**: Sign up, log in, and reset password.
2. **Profile Management**: Edit profile details, including updating avatar and contact information.
3. **Coffee Exploration**: Browse through various coffee types and add them to the cart.
4. **Cart Management**: Add, remove, and adjust quantities of items in the cart, with a total price calculation.
5. **Journal**: Maintain a journal of coffee experiences with the option to add images and detailed notes.
6. **Camera**: Take photos directly within the app or choose from gallery for profile pictures and journal entries.
7. **Location**: Manage delivery addresses with Google Places integration and interactive map selection.
8. **Payment Management**: Add and manage multiple payment methods securely.
9. **Help & Support**: Access FAQ section, submit support tickets, and contact customer service.
10. **CoffeeDetail**: Created by Xi Xi, this component displays detailed information about a selected coffee, including its description, ingredients, and the option to add it to the cart or mark it as a favorite.
11. **Favourite**: Created by Xi Xi, this component allows users to view and manage their favorite coffees, with the ability to navigate to detailed views of each coffee.
12. **CoffeeSocialInteraction**: Created by YiXiang Zhou, this component provides a platform for users to interact with a virtual coffee expert, ask questions, and receive daily coffee tips and fun facts.

## File Structure and Key Components
- **Signup.js**: Handles user sign-up, form validation, and navigation to the login screen if the user already has an account.
- **Login.js**: Provides login functionality with email and password validation, including navigation to the sign-up screen for new users.
- **Profile.js**: Displays user information with options for viewing order history, favorites, and updating account settings.
- **Journal.js**: Main journal page, displaying entries filtered by the user's ID. Includes a search bar and profile statistics.
- **JournalDetail.js**: Displays details of a single journal entry. Options for editing or deleting entries.
- **Home.js**: Main screen with categories of coffee, including search and category-based filtering.
- **AddJournal.js**: Allows users to create new journal entries with images and descriptive text.
- **Cart.js**: Displays items in the cart, allows quantity adjustments, and calculates the total price.
- **EditProfile.js**: Allows users to edit profile details, including name, phone, and address, and update the avatar.
- **NotificationManager.js**: Implements reminders for users to buy coffee at a fixed time each day.
- **Payment.js**: Handles checkout functionality with payment confirmation.
- **About.js**: Displays app and team information.
- **CoffeeDetail.js**: Displays detailed information about a selected coffee, including its description, ingredients, and the option to add it to the cart or mark it as a favorite.
- **Favorite.js**: Allows users to view and manage their favorite coffees, with the ability to navigate to detailed views of each coffee.
- **CoffeeSocialInteraction.js**: Provides a platform for users to interact with a virtual coffee expert, ask questions, and receive daily coffee tips and fun facts.
- **PaymentSuccess.js**: Displays a confirmation message after a successful payment, including order details and a summary of purchased items.
- **History.js**: Displays the user's order history, including order details, status, and items purchased.


## Firestore Collections and Data Model
- **users**: Stores user profile details (e.g., email, username, avatar).
- **cart**: Manages items added to the cart by users, with fields for item details and quantities.
- **journals**: Holds user journal entries, including title, content, and image URL.

### Example Data Models
- **User Profile**
  ```json
  {
    "displayName": "John Doe",
    "email": "johndoe@example.com",
    "phone": "123-456-7890",
    "address": "123 Coffee St.",
    "imageUri": "file:///path/to/avatar.jpg",
    "userId": "user123"
  }
  ```
- **Journal Entry**
  ```json
  {
    "title": "My First Espresso",
    "content": "Loved the richness of the espresso. Perfect start to the day!",
    "date": "2024-11-12T10:01:19.000Z",
    "imageUri": "file:///path/to/image.jpg",
    "userId": "user123"
  }
  ```
- **Cart Item**
  ```json
  {
    "userId": "user123",
    "id": "coffee123",
    "name": "Espresso",
    "imageUri": "file:///path/to/coffee.jpg",
    "price": 4.99,
    "quantity": 2
  }

- **Orders**
  ```json
  {
  "userId": "bDpX3jPEDEhx4HScSWHnSJcFJE13",
  "items": [
    {
      "id": "C11",
      "name": "Espresso",
      "quantity": 1,
      "price": 3.15,
      "imageUri": "https://example.com/espresso.jpg"
    }
  ],
  "totalPrice": 3.15,
  "paymentMethodId": "0iH4piRU4Sss4oFJ3aNh",
  "status": "completed",
  "timestamp": "2024-12-04T03:32:20.293Z"
  }
  ```

- **Payment Methods**
  ```json
  {
  "userId": "bDpX3jPEDEhx4HScSWHnSJcFJE13",
  "cardHolder": "John Doe",
  "cardNumberMasked": "****1231",
  "expiryDate": "12/27",
  "cvv": "123",
  "createdAt": "2024-12-04T02:41:41.992Z"
  }
  ```

## CRUD Operations
- **Authentication**: Uses Firebase Authentication for login and sign-up.
- **Database**: Firebase Firestore stores data for user profiles, cart items, and journal entries.

| Collection | Operations |
|------------|------------|
| `users`    | `createUserProfile`, `fetchUserProfile`, `updateUserProfile` |
| `cart`     | `fetchCartItems`, `addOrUpdateCartItem`, `deleteCartItem` |
| `journals` | `fetchJournals`, `addJournalEntry`, `deleteJournalEntry` |

## Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /cart/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /journals/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Prerequisites

To use the `CoffeeSocialInteraction` feature, you need to obtain a free ChatGPT API key from OpenAI. Follow these steps:

1. **Sign up at OpenAI**  
   Create an account by visiting [OpenAI](https://github.com/popjane/free_chatgpt_api?tab=readme-ov-file).

2. **Generate an API key**  
   - Log in to your OpenAI account.  
   - Navigate to the API Keys section in the dashboard.  
   - Generate a new API key.  

3. **Add the API key to your `.env` file**  
   Save the API key in your environment file with the following format:
   ```bash
   EXPO_PUBLIC_openAIApiKey=your_openai_api_key_here

## Contributions
- **YiXiang Zhou**
  - Set up app navigation and overall structure.
  - Implemented authentication and CRUD operations for Firestore.
  - Developed Home Login, Signup, Profile, and Edit Profile screens.
  - Implemented Authentication, Location use and External API use.
  <img src="./assets/readme_images/homePage.png" alt="Home Page" width="200"/>
  <img src="./assets/readme_images/profilePage.png" alt="Profile Page" width="200"/>
  <img src="./assets/readme_images/editProfilePage.png" alt="Edit Profile Page" width="200"/>
  <img src="./assets/readme_images/aboutus.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/helpsupport.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/location.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/location2.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/paymentmethods1.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/paymentmethods2.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/quotesapi.png" alt="About Us" width="200"/>
  <img src="./assets/readme_images/sidebar.png" alt="Side Bar" width="200"/>
  <img src="./assets/readme_images/coffeesocialreaction.png" alt="Coffee Social Reaction" width="200"/>
  <img src="./assets/readme_images/Payment.png" alt="payment" width="200"/>
  <img src="./assets/readme_images/PaymentSuccess.png" alt="PaymentSuccess" width="200"/>
  <img src="./assets/readme_images/order.png" alt="order" width="200"/>
  
- **Xi Xi**
  - Set up app navigation and overall structure.
  - Developed Home, Cart, Journal, Add Journal and Journal Detail screens.
  - Integrated Firestore interactions in the Cart and Journal sections.
  - Created README documentation.
  - Implemented Camera use, Notification use
  <img src="./assets/readme_images/cartPage.png" alt="Cart Page" width="200"/>
  <img src="./assets/readme_images/journalPage.png" alt="Journal Page" width="200"/>
  <img src="./assets/readme_images/addJournalPage.png" alt="Add Journal Profile Page" width="200"/>
  <img src="./assets/readme_images/notificationSet.png" alt="Add Journal Profile Page" width="200"/>
  <img src="./assets/readme_images/notification.png" alt="Add Journal Profile Page" width="200"/>
  <img src="./assets/readme_images/notificationSetSuccess.png" alt="Add Journal Profile Page" width="200"/>
  <img src="./assets/readme_images/coffeedetail.png" alt="Coffee Detail" width="200"/>
  <img src="./assets/readme_images/favourite.png" alt="Favourite" width="200"/>
