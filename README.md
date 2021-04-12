# CheckPwnedPassword
A mobile app made with React Native to check how many times a given password has been seen in known database breaches. This app talks to an API hosted by haveibeenpwned.com

## To Install
You can either download it from the Google Play store here: https://play.google.com/store/apps/details?id=com.checkpwnedpassword

Or, assuming you have your Android and/or iOS development environments set up, you can clone this repo and compile it yourself.
Enter the following commands at the command line:
1. git clone https://github.com/Techno-Hwizrdry/CheckPwnedPassword.git
2. cd checkpwnedpassword
3. yarn install
4. cp android/gradle.properties_example android/gradle.properties
5. Add key and store passwords to android/gradle.properties
6. yarn build
