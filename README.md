# teu-school-bus-bot
東京工科大学の次のスクールバスを教えてくれるSlackBotだよ.

# How to use
* node実行可能環境用意(ES6サポート要)
* 環境変数:SLACK_TOKENを設定

その上で
```bash
npm install
npm start
```
で起動.

# コマンド
botがmessageを受け取れる場所で
* 行こうか : 八王子=>大学のバス表示
* 帰ろうか : 大学=>八王子のバス表示
* 買い出しかな : 大学=>みなみ野のバス表示
* 歩こうか : みなみ野=>大学のバス表示

という感じで使える

例)
![exampleimg](https://i.gyazo.com/4f3eb82ff1c812045f857c1f69feeb70.png)

# 時刻あってるの？
たぶんあってる.
東京工科大学スクールバスAPI(非公式)に依存.



