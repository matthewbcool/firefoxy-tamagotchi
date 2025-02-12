# Firefoxy Tamagotchi

Firefoxy Tamagotchi is an immersive application that combines Extended Reality (XR) experiences with AI capabilities using the Firefox AI Platform. This project leverages the pmndrs-xr library for creating engaging XR environments and the Firefox AI inference engine for real-time AI processing.

## Features

- **XR Environment**: Enter AR and VR modes seamlessly with intuitive interactions.
- **AI Integration**: Utilize local AI inference for various tasks directly in the browser.
- **Interactive Components**: Engage with 3D objects and AI functionalities in a cohesive experience.

## Setup Instructions

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/Firefoxy-Tamagotchi.git
   cd Firefoxy-Tamagotchi
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Enable Firefox AI API**:
   - Open `about:config` in Firefox and set the following flags:
     - `browser.ml.enable` → true
     - `extensions.ml.enabled` → true

4. **Run the Application**:
   ```sh
   npm start
   ```

5. **Open in Browser**:
   Navigate to `http://localhost:3000` to view the application.

## Usage

- Use the buttons in the XR environment to enter AR or VR modes.
- Interact with 3D objects to trigger AI functionalities.
- Monitor AI inference progress through the console.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.