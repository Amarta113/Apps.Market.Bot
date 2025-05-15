<div align="center">
  <img width=30% src="https://github.com/user-attachments/assets/a92f27b9-5101-4725-8311-a0e6ada0edc7" alt="market-bot-illustration">
</div>

<h1 align="center">Rocket.Chat Smart Market Bot</h1>

We’ve all scrambled to check the latest price swings or market news across multiple tabs. With the AI Market Bot, that’s a thing of the past. This Rocket.Chat app brings live crypto, stock, and forex data right into your chats. It comes with smart insights, alerts, and data-backed predictions so you can stay informed, react faster, and skip the guesswork.

<h2>🚀 Features</h2>
<ul>
  <li>Live Price Updates – Fetch real-time data for crypto, stocks, and forex using free and open APIs.</li>
  <li>Market Alerts – Get notifications on significant price movements, trends, or unusual activities.</li>
  <li>Smart Insights & Summaries – Summarize asset trends, news, and market behavior.</li>
  <li>Predictive Analysis – Provide data-backed forecasts and trends (without unreliable speculations).</li>
  <li>Fail-Safe AI Responses – Ensures that if the LLM is uncertain, it explicitly avoids misinformation.</li>
  <li>Custom Asset Watchlists – Users can create personalized lists to track selected assets.</li>
  <li>Interactive Commands – Users can request price comparisons, asset history, and more via Rocket.Chat commands.</li>
</ul>


<h2 >⚙️ Installation </h2>

<ol>
  <li>Have a Rocket.Chat server ready. If you don't have a server, see this <a href="https://developer.rocket.chat/v1/docs/server-environment-setup">guide</a>.</li> 
  <li>Install the Rocket.Chat Apps Engline CLI. 
  
  ``` 
    npm install -g @rocket.chat/apps-cli
  ```
  
  Verify if the CLI has been installed 
  
  ```
  rc-apps -v
# @rocket.chat/apps-cli/1.4.0 darwin-x64 node-v10.15.3
  ```
  </li>
  <li>Clone the GitHub Repository</li>
    
 ```
    git clone https://github.com/RocketChat/Apps.Market.Bot.git
 ```
  <li>Navigate to the repository</li>
    
 ```
    cd Apps.Market.Bot
 ```
  
  <li>Install app dependencies</li>
  
  ```
    cd app && npm install
  ```
  
  <li>To install private Rocket.Chat Apps on your server, it must be in development mode. Enable Apps development mode by navigating to <i>Administration > General > Apps</i> and turn on "Enable development mode".</li>
  
  <li>Deploy the app to the server </li>
  
  ```
  rc-apps deploy --url <server_url> --username <username> --password <password>
  ```
  
  - If you are running server locally, `server_url` is http://localhost:3000. If you are running in another port, change the 3000 to the appropriate port.
  - `username` is the username of your admin user.
  - `password` is the password of your admin user.

  <li> Open the App, by navigating to <i>Administration > Marketplace > Private Apps</i>. You should see the app listed there. Click on the App name to open the app.</li>

</ol>

## 🧑‍💻 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: adds some amazing feature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

## 📚 Resources

Here are some links to examples and documentation:

- [Rocket.Chat Apps TypeScript Definitions Documentation](https://rocketchat.github.io/Rocket.Chat.Apps-engine/)
- [Rocket.Chat Apps TypeScript Definitions Repository](https://github.com/RocketChat/Rocket.Chat.Apps-engine)
- [Example Rocket.Chat Apps](https://github.com/graywolf336/RocketChatApps)
- [DemoApp](https://github.com/RocketChat/Rocket.Chat.Demo.App)
- [GithubApp](https://github.com/RocketChat/Apps.Github22)
- Community Forums
  - [App Requests](https://forums.rocket.chat/c/rocket-chat-apps/requests)
  - [App Guides](https://forums.rocket.chat/c/rocket-chat-apps/guides)
  - [Top View of Both Categories](https://forums.rocket.chat/c/rocket-chat-apps)
- [#rocketchat-apps on Open.Rocket.Chat](https://open.rocket.chat/channel/rocketchat-apps)


