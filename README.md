# WiFiTactical

## Release Notes

### V 1.0.2

 - [BUILD: 115] Free AP功能
 - [BUILD: 105] 封包摘要功能增加MAC與時間資訊

### V 1.0.1

 - [BUILD: 110] 網路釣魚功能第二版
 - [BUILD:  89] 增加角色的多國語系功能
 - [BUILD:  88] 增加多國語系功能

## Structure Description

### Plugin Package

WiFiTactical@1.0.0
├── async@0.9.0
├── cron@1.0.5
├── ejs@1.0.0
├── express@3.2.6
├── fs.extra@1.2.1
├── i18next@1.7.10
├── mime@1.2.11
├── moment@2.8.3
├── mssql@1.3.0
├── nodemailer@1.3.1
├── nodemailer-smtp-transport@1.0.0
├── properties-parser@0.2.3
├── python-shell@0.0.3
├── slide@1.1.6
├── sqlite3@3.0.2
└── xml2js@0.4.4

### Project Structure

WiFiTactical
├─┬ api: 擺放RESTful的controller
│ ├── chatApi.js: [Reverse]提供App聊天資料的取得
│ ├── fakeApApi.js: 提供建立、攻擊等Fake AP功能
│ ├── freeApApi.js: 提供建立Free AP、呈現連線Client功能
│ ├── phishingSiteApi.js: 提供釣魚所得到的account & password資料的取得
│ ├── pktSummaryApi.js: 提供Summary資料的取得
│ ├── roleApi.js: 提供角色資料的取得
│ ├── targetApi.js: [Reverse]提供監察目標資料的取得
│ └── userApi.js: 提供使用者資料的CRUD
│
├─┬ constant: 
│ ├── database_prop.js: 將database.properties轉成JavaScript Object
│ └── wifitactical_prop.js: app.properties轉成JavaScript Object
│
├─┬ dao
│ └── sqlite.js: sqlite的data scource
│
├─┬ handel
│ └── crossDomainHandler.js: 處理ajax跨domain的呼叫
│
├─┬ job
│ ├── msgId.txt: 記錄message id
│ ├── reverseImageCloningJob.js: [未使用]定期複製reverse的圖檔
│ ├── summaryDataTransferJob.js: 定期將所收到的XML轉JavaScript Object後存至sqlite
│ └── summaryImageCloningJob.js: [未使用]定期複製summary的圖檔
│
├─┬ locales: i18n的語系檔
│ ├── dev: 預設語系(目前使用英文)
│ ├── en: 英文
│ ├── en-US: 美語
│ ├── zh: 華文
│ └── zh-TW: 繁體中文
│
├─┬ models:
│ ├── chat.js: 實作chat的DB查詢
│ ├── fakeAp.js: 實作與python溝通
│ ├── freeAp.js: 實作與python溝通
│ ├── phishingAccount.js: 實作新增/查詢釣魚所得到的account & password資料
│ ├── phishingSite.js: 實作查詢釣魚網站資料
│ ├── pktSummaryData.js: 實作新增/刪除/查詢Summary資料
│ ├── pktSummaryType.js: 實作查詢Summary資料的類別
│ ├── pktTarget.js: 實作新增Summary的目標資訊
│ ├── role.js: 實作查詢角色資料
│ ├── target.js: [未使用]實作查詢target資料
│ └── user: 實作新增/刪除/修改/查詢user資料
│
├─┬ module
│ ├── imageCloning.js: [未使用]複製圖檔
│ ├── mailSender.js: [未使用]寄送Email
│ └── summaryDataTransfer.js: 解析Summary XML
│
├─┬ prop: 擺放設定檔
│ ├── app.properties: WiFiTactical系統設定檔
│ └── database.properties: [Reverse]ms-sql連線系統設定檔
│
├─┬ public: 擺放靜態資源
│ ├── csr: [未使用]擺放憑證
│ ├── css: 擺放CSS
│ ├── font: 擺放字型
│ ├── images: 擺放圖檔
│ └── js: 擺放前端JavaScript檔
│
├─┬ routes: 擺放頁面功能的controller
│ ├── accountManagementCtrl.js: Account管理功能
│ ├── fakeApCtrl.js: Fake AP功能
│ ├── freeApCtrl.js: Free AP功能
│ ├── index.js: 根目錄導頁功能
│ ├── messagingMonitorCtrl.js: [Reverse]App通訊記錄功能
│ ├── phishingAccountCtrl.js: 網路釣魚功能
│ ├── pktSummaryCtrl.js: 封包摘要功能
│ ├── targetManagementCtrl.js: [未使用]監察目標管理功能
│ └── userCtrljs: 使用者管理功能
│
├─┬ security
│ └── authorizationHandle.js: 權限控制
│
├─┬ shellscript: 擺放linux上所使用的shell
│ ├── gorilla-fake-chtwifi: 啟動Fake_CHT_WiFi，設定成service，放在linux上的/etc/init.d下。
│ ├── gorilla-fake-facebook: 啟動Fake_Facebook，設定成service，放在linux上的/etc/init.d下。
│ ├── gorilla-fake-google: 啟動Fake_Google，設定成service，放在linux上的/etc/init.d下。
│ ├── gorilla-fake-wifi-ap: 啟動Fake_WiFi_AP，設定成service，放在linux上的/etc/init.d下。
│ ├── gorilla-fake-yahoo: 啟動Fake_Yahoo，設定成service，放在linux上的/etc/init.d下。
│ ├── gorilla-shutdown.sh: 啟動Fake_CHT_WiFi、Fake_Facebook、Fake_Google、Fake_Yahoo、WiFiTactical，放在linux上的/root下。
│ ├── gorilla-startup.sh: 啟動Fake_CHT_WiFi、Fake_Facebook、Fake_Google、Fake_Yahoo、WiFiTactical，放在linux上的/root下。
│ └── gorilla-wifitactical: 啟動WiFiTactical，設定成service，放在linux上的/etc/init.d下。
│
├── sqlite: 擺放sqlite的db檔
├── test_py: [未使用]當初測試python之用
│
├─┬ view: 版型
│ ├── hacker: Fake AP與Phishing Account的頁面
│ ├── management: 管理功能的頁面
│ ├── monitor: App通訊記錄的頁面
│ ├── pktDecoder: 封包摘要的頁面
│ ├── template: 共用template
│ └── user: 登入的頁面
│
├── app.js: express js的server
├── init_sqlite_schema.js: 初始資料庫的script
├── package.json: NPM所需的檔案
└── README.md: Project的說明檔

### Relational Project

For KL POC.
 - Fake_CHT_WiFi: 假的中華電信WiFi登入頁面，svn位置WiFiTactical/trunk/Fake_CHT_WiFi
 - Fake_Facebook: 假的Facebook登入頁面，用來騙取帳密，svn位置WiFiTactical/branches/Fake_Facebook
 - Fake_Google: 假的Google登入頁面，用來騙取帳密，svn位置WiFiTactical/branches/Fake_Google
 - Fake_Yahoo: 假的Yahoo登入頁面，用來騙取帳密，svn位置WiFiTactical/trunk/Fake_Yahoo
 - Fake_WiFi_AP: Free WiFi AP登入頁面，用來騙取使用者註冊、安裝憑證，svn位置WiFiTactical/trunk/Fake_WiFi_AP

### Shell Script

 - gorilla-fake-chtwifi: 啟動Fake_CHT_WiFi，設定成service，放在linux上的/etc/init.d下。
 - gorilla-fake-facebook: 啟動Fake_Facebook，設定成service，放在linux上的/etc/init.d下。
 - gorilla-fake-google: 啟動Fake_Google，設定成service，放在linux上的/etc/init.d下。
 - gorilla-fake-wifi-ap: 啟動Fake_WiFi_AP，設定成service，放在linux上的/etc/init.d下。
 - gorilla-fake-yahoo: 啟動Fake_Yahoo，設定成service，放在linux上的/etc/init.d下。
 - gorilla-shutdown.sh: 啟動Fake_CHT_WiFi、Fake_Facebook、Fake_Google、Fake_Yahoo、WiFiTactical，放在linux上的/root下。
 - gorilla-startup.sh: 啟動Fake_CHT_WiFi、Fake_Facebook、Fake_Google、Fake_Yahoo、WiFiTactical，放在linux上的/root下。
 - gorilla-wifitactical: 啟動WiFiTactical，設定成service，放在linux上的/etc/init.d下。

## Other Info

 - 由於系統換到Ubuntu上，所以再安裝node js package時，請不要使用npm install，改用sudo /root/.nvm/v0.10.34/bin/npm install。
 - Fake_WiFi_AP下attachment folder是用來放置註冊信的夾檔，發信時會將該資料夾內所有檔案都附在E-mail上。