## GitHubのOAuthによる認証・認可
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
