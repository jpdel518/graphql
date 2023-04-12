## First Build
nodemodulesが作られていないためnpm installを手動で実行する必要がある
1. app/src/DockerfileのENTRYPOINTのコメントアウトを外す
2. docker-compose up -d --buildでビルドを実行
3. docker-compose exec -it node sh
4. npm installを実行
5. node index.js
6. npx prisma migrate dev
7. exit
8. DockerfileのENTRYPOINTをコメントアウト

## 起動
1. docker-compose up -dでビルドを実行
2. docker-compose exec -it client sh
3. npm startを実行
4. ブラウザでhttp://localhost:3000にアクセス
5. （optional...もしDBが空になってしまったら）
6. docker-compose exec -it node sh
7. npx prisma migrate dev

## リクエストお試し実行環境
- Apollo Studio: `http://localhost:8080/graphql`
- GraphQL Playground: `http://localhost:8080/playground`

## GitHubのOAuthによる認証・認可の流れ
### 登録
1. GitHubでOAuth設定  
[Settings] -> [Developer settings] -> [OAuth Apps]から作成  
ClientIDとClientSecretを取得する
2. 本アプリのsignupを実行  
1で取得したClientIDとClientSecretをパラメーターに設定してリクエスト

### 認証・認可
1. 本アプリのgetCodeを実行  
返ってきたURL（GitHubのサイト）にアクセス  
GitHubのサイト上で、この Web アプリに情報を提供してもいいかの確認が表示される。OKすると、あらかじめ登録してあったコールバックアドレスにWebブラウザがリダイレクトする。  
リダイレクトした先のURL の末尾にアクセストークン取得用の一時コード(temporary code)がついている。
1. 本アプリのsigninを実行  
ClientIDと取得したtemporary codeをパラメーターに設定してリクエスト  
アクセストークンが返り値に返ってくる
5. Authorization headerにアクセストークンを設定して任意のAPIを実行
