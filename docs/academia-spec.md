# プロダクト仕様書

> **最終更新日:** 2025-11-02  
> **作成者:** Akira Hirose  
> **目的:** 本ドキュメントはプロダクト全体の仕様、機能、構成、データモデル、外部連携を包括的に記載し、変更時の参照・更新を容易にすることを目的とする。

---

## 1. プロダクト概要

### 1.1 プロダクト名
Dr.'s Prime Academia

### 1.2 概要
このプロダクトは、医師や医学生をターゲットした動画配信メディアとなっている。縦スクロール形式で、動画コンテンツで医療情報を学習することができる。
またその動画コンテンツは、医師がzoomなどを利用し録画したものを動画編集チームが、編集しadmin-tool（自社で開発した社内管理ツール）を利用して動画をアップロードすることができる。
動画コンテンツには、「いいね」をすることが可能となっている。「いいね」したユーザーは自分のチャンネルページで過去の「いいね」履歴として視聴可能。
1人のユーザーが持つチャンネルに紐づいている。

Academiaは、ポイ活を目的としている医師がいない（ポイ活機能がない）ので、純粋に学びに意欲のある医師が存在している。
その強みを生かして、企業や病院のPR動画を配信しマネタイズしている。

### 1.3 ターゲットユーザー
- 医師
- 医学生
- 一般患者（後々）

### 1.4 主要価値・特徴
- 特徴①：
- 特徴②：
- 特徴③：

### 1.5 技術スタック概要
| 区分 | 採用技術 |
|------|-----------|
| フロントエンド | Next.js / TypeScript |
| バックエンド | NestJS / Node.js |
| データベース | PostgreSQL |
| インフラ | AWS / GCP |
| その他 | Sentry, Datadog, OpenAI API |

---

## 2. 主要機能一覧

### 2.1 ユーザー管理機能 {#user-management}

#### 機能概要
ユーザーの登録・認証・プロフィール編集を行う。

#### ユースケース
- 新規登録
- ログイン・ログアウト
- パスワードリセット

#### 仕様詳細
- メールアドレス・パスワード必須
- MFA対応（オプション）
- パスワードバリデーション：8文字以上・英数字混在

#### API
| メソッド | エンドポイント | 概要 |
|-----------|----------------|------|
| POST | `/api/users` | ユーザー登録 |
| POST | `/api/login` | ログイン |

#### データモデル
- `User` テーブル：id, email, password_hash, created_at

#### 関連機能・依存関係
- 認証API
- 通知機能（登録完了メール）

#### 影響範囲
- DBスキーマ変更が他APIに波及
- 認証トークン仕様の変更で全サービス影響

#### 変更履歴
| 日付 | 内容 | 対応者 |
|------|------|--------|
| 2025-11-02 | 初版作成 | Akira |

---

### 2.2 決済機能 {#payment}

#### 機能概要
ユーザーがサービスを購入・支払いできる仕組みを提供。

#### ユースケース
- クレジットカードによる決済
- 請求書発行

#### 仕様詳細
- Stripe連携
- 返金フロー定義済み
- 決済ステータス：Pending / Succeeded / Failed

#### API
| メソッド | エンドポイント | 概要 |
|-----------|----------------|------|
| POST | `/api/payments` | 決済実行 |
| GET | `/api/payments/:id` | 決済詳細取得 |

#### データモデル
- `Payment` テーブル：id, user_id, amount, status, created_at

#### 関連機能・依存関係
- ユーザー管理機能
- 通知機能（決済完了メール）

#### 影響範囲
- Stripe APIの仕様変更
- 決済金額計算ロジックの改修

#### 変更履歴
| 日付 | 内容 | 対応者 |
|------|------|--------|
| 2025-11-02 | 初版作成 | Akira |

---

### 2.3 通知機能 {#notification}

#### 機能概要
システムイベントに基づきメール・Slack通知を送信。

#### ユースケース
- 登録完了通知
- 決済完了通知
- アラート通知（管理者向け）

#### 仕様詳細
- 通知テンプレート管理
- 通知チャネル（email, Slack）
- 通知キュー（非同期処理）

#### API
| メソッド | エンドポイント | 概要 |
|-----------|----------------|------|
| POST | `/api/notifications` | 通知送信リクエスト |

#### データモデル
- `NotificationLog`：id, type, status, created_at

#### 関連機能・依存関係
- ユーザー管理機能
- 決済機能

#### 影響範囲
- 通知テンプレート変更時に複数イベントへ波及
- キュー構成変更時に非同期処理全体へ影響

#### 変更履歴
| 日付 | 内容 | 対応者 |
|------|------|--------|
| 2025-11-02 | 初版作成 | Akira |

---

## 3. システム構成 {#system-architecture}

### 3.1 構成図（概要）


### 3.2 サービス構成
| サービス名 | 役割 |
|-------------|------|
| web | フロントエンド（Next.js） |
| api | バックエンド（NestJS） |
| db | データ永続化（PostgreSQL） |

### 3.3 非機能要件
- スケーラビリティ：ECS オートスケーリング
- セキュリティ：JWT, HTTPS必須
- 可観測性：Datadog, Sentryによる監視

---

## 4. API仕様一覧 {#api-summary}

| 機能 | メソッド | エンドポイント | 概要 |
|------|-----------|----------------|------|
| ユーザー登録 | POST | `/api/users` | 新規ユーザー登録 |
| ログイン | POST | `/api/login` | 認証 |
| 決済実行 | POST | `/api/payments` | 決済処理 |
| 通知送信 | POST | `/api/notifications` | 通知送信 |

---

## 5. データモデル {#data-model}

### 5.1 エンティティ一覧
| テーブル名 | 主キー | 主なカラム | 関連 |
|-------------|--------|-------------|------|
| users | id | email, password_hash | payments, notifications |
| payments | id | user_id, amount, status | users |
| notifications | id | user_id, type, status | users |

### 5.2 ER 図（概要）
erDiagram
    USERS {
        text id PK
        text first_name
        text last_name
        text email
        datetime created_at
        datetime updated_at
    }
    
    PUBLISHERS {
        text id PK
        text name
	      text x_url
        text facebook_url
        text linkedin_url
        text link_url
        datetime created_at
        datetime updated_at
    }
    
    CHANNELS {
        text id PK
        text name
        text thumbnail_url
        datetime created_at
        datetime updated_at
    }
    
    USER_CHANNELS {
        text id PK
        text user_id FK "UNIQUE"
        text channel_id FK "UNIQUE"
        datetime created_at
        datetime updated_at
    }
    
    PUBLISHER_CHANNELS {
        text id PK
        text publisher_id FK "UNIQUE"
        text channel_id FK "UNIQUE"
        datetime created_at
        datetime updated_at
    }
    
    CONTENTS {
        text id PK
        text channel_id FK
        text reference_content_id FK
        text reference_url
        datetime created_at
        datetime updated_at
        datetime published_at
    }
    
    VIDEOS {
        text id PK
        text content_id FK
        text title
        text description
        text video_url
        text thumbnail_url
        int duration_seconds
        datetime created_at
        datetime updated_at
    }
    
    PROMOTION_VIDEOS {
        text id PK
        text content_id FK
        text title
        text description
        text video_url
        text thumbnail_url
        datetime feed_start_date
        datetime feed_end_date
        datetime created_at
        datetime updated_at
    }
    
    FEED_ENTRIES {
        text id PK
        text content_id FK
        date feed_date
        int order
        datetime created_at
        datetime updated_at
    }
    
    CONTENT_LIKES {
        text id PK
        text content_id FK
        text user_id FK
        datetime created_at
        datetime updated_at
    }

    USER_FEED_ENTRIES {
        text id PK
        text user_id FK
        text content_id FK
        int order "From vector search distance"
        datetime created_at
        datetime updated_at
    }
    
    USERS ||--|| USER_CHANNELS : "owns"
    USER_CHANNELS ||--|| CHANNELS : "owned by user"
    PUBLISHERS ||--|| PUBLISHER_CHANNELS : "owns"  
    PUBLISHER_CHANNELS ||--|| CHANNELS : "owned by publisher"
    CHANNELS ||--o{ CONTENTS : "publishes"
    CONTENTS ||--o{ VIDEOS : "has video"
    CONTENTS ||--o{ PROMOTION_VIDEOS : "has promotion videos"
    CONTENTS ||--o{ FEED_ENTRIES : "listed in common feed"
    CONTENTS ||--o{ CONTENTS : "references"
    USERS ||--o{ CONTENT_LIKES : "gives like"
    CONTENTS ||--o{ CONTENT_LIKES : "liked by"
    USERS ||--o{ USER_FEED_ENTRIES : "has personalized feed"
    CONTENTS ||--o{ USER_FEED_ENTRIES : "appears in personalized feed"


---

## 6. 外部サービス連携 {#external-services}

| サービス | 用途 | 接続方式 |
|-----------|------|-----------|
| Stripe | 決済処理 | REST API |
| SendGrid | メール通知 | SMTP / API |
| Slack | アラート通知 | Webhook |

---

## 7. 変更履歴 {#changelog}

| 日付 | 変更内容 | 対応者 |
|------|------------|--------|
| 2025-11-02 | 初版作成 | Akira |
| 2025-11-03 | 決済機能追加 | Akira |
| 2025-11-05 | 通知機能追加 | Akira |

---

> 💡 **AI運用メモ**
> - 「#user-management セクションを更新して」といえばその部分のみを更新できる。
> - 「決済機能にサブスクリプションを追加して」といえば、2.2節を改変し、関連API・影響範囲も自動修正できる。
> - 「影響範囲を抽出して」といえば、依存関係をもとに横断的に推論できる。
