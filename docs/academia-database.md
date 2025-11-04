# dp-moet-prd.data_warehouse.product_users

## 概要
- Academia　会員についての情報
- Product登録したユーザーの情報を格納。β版のみの登録ユーザーは含まれない

## DB構造
| Column Name | Data Type | Description | Note | 元テーブル | 元カラム名 | 登録 | 編集 | 削除 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| user_id | STRING | ユーザーの一意なID	 | `Doctors.doctor_id` が元データ | `beer-qa.data_warehouse.Doctors` | `doctor_id` |  |  |  |
| regist_at | TIMESTAMP | Academiaのアカウント登録日時 | `academia_registered_at` を優先し、欠損時は `unknown_registered_at`, GAの初回アクセス日時, `users.created_at` の順で補完。サービス統合前の過去データはGA日時で補完されている場合がある。
———————
2022/11/1まではサービスごとの会員登録時間が残らなかったため、過去分はGAの初回アクセス時間で補完している
issue: [サービスごとの会員登録日を残す #366](https://github.com/drs-prime/moet/issues/366) | 複合ロジック |  |  |  |  |
| basic_info_regist_at | TIMESTAMP | Academiaで基本情報登録した日時 | `users`テーブルの`created_at`（JST変換後）が入る。 | `dp-moet-prd.cloudsql_imports_views.users` | `created_at` | Academiaで基本情報を登録した日時。 |  |  |
| moet_last_login_at | TIMESTAMP | 最終ログイン日時 | moetの`users`テーブルの`last_login_at`（JST変換後）が入る。 | `dp-moet-prd.cloudsql_imports_views.users` | `last_login_at` | 同上 |  |  |
| name | STRING | 氏名 |  | `beer-qa.data_warehouse.Doctors` | full_name |  |  |  |
| kana | STRING | 氏名（フリガナ） |  | `beer-qa.data_warehouse.Doctors` | `full_name_kana` |  |  |  |
| account_type | STRING | アカウント種別 | 医師 / 医学生 | `dp-moet-prd.cloudsql_imports_views.users` | `account_type` |  |  |  |
| telephone_number | STRING | 電話番号 |  | `beer-qa.data_warehouse.Doctors` | telephone_number |  |  |  |
| email | STRING | メールアドレス |  | `beer-qa.data_warehouse.Doctors` | email |  |  |  |
| introducer | STRING | 紹介者名 |  | `beer-qa.data_warehouse.Doctors` | introducer |  |  |  |
| work_user | BOOLEAN | Workユーザーかどうか |  | `beer-qa.data_warehouse.Doctors` | is_work_registered |  |  |  |
| application_count | INTEGER	 | イベント申込回数	 | `user_events`テーブルを元に算出 | `dp-moet-prd.cloudsql_imports_views.user_events` | 集計 |  |  |  |
| first_application_date | TIMESTAMP | 初回イベント申込日時 | user_eventsテーブルの最も古いcreated_at | `dp-moet-prd.cloudsql_imports_views.user_events` | 集計 |  |  |  |
| last_application_date | TIMESTAMP | 最終イベント申込日時 | user_eventsテーブルの最も新しいcreated_at | `dp-moet-prd.cloudsql_imports_views.user_events` | 集計 |  |  |  |
| total_participation | INTEGER | 総イベント参加回数 | user_event_participation_historiesテーブルを元に算出 | `dp-moet-prd.cloudsql_imports_views.user_events` | 集計 |  |  |  |
| hospital_name | STRING | 勤務先病院名
選択肢から選んだ場合 | 病院マスタに病院が存在せず、ユーザーがリクエストした場合は入らない（P.Opsで対応後に入る）
※[チラシ送付管理/送付歴](https://docs.google.com/spreadsheets/d/1XPQCyQDYDVWg-hsmKbFUSVMZHDYSmnhj_dDqrPjV708/edit#gid=406480565)F列がNGのユーザーは、勤務先病院に現在在籍していないことが判明している人 | `beer-qa.data_warehouse.Doctors` | `current_medical_institution_hospital_name` |  |  |  |
| request_hospital_name | STRING | 自由記述で入力した勤務先 | 病院マスタ未登録の病院をユーザーがリクエストした場合に一時的に格納される情報。 | `dp-moet-prd.cloudsql_imports_views.hospital_registration_requests` |  |  |  |  |
| general_hospital_id | STRING | 勤務先病院のID | 病院マスタに病院が存在せず、ユーザーがリクエストした場合は入らない（P.Opsで対応後に入る） | `beer-qa.data_warehouse.Doctors` | `current_medical_institution_general_hospital_id` |  |  |  |
| hospital_address | STRING | 勤務先病院の住所 |  | `beer-qa.data_warehouse.Doctors` | address |  |  |  |
| request_hospital_address | STRING | 自由記述で入力した勤務先住所 |  | `dp-moet-prd.cloudsql_imports_views.hospital_registration_requests` |  |  |  |  |
| professional_clinical_department | STRING | 所属診療科 |  | `beer-qa.data_warehouse.Doctors` | professional_clinical_department |  |  |  |
| license_year | STRING | 医籍取得年 |  | `dp-moet-prd.cloudsql_imports_views.users` | license_year |  |  |  |
| my_page | STRING | ユーザーのMyページのURL | 基本情報登録まで完了している人しか存在しない | `dp-moet-prd.cloudsql_imports_views.users` | my_page_idから生成 |  |  |  |
| birth_date | DATE | 生年月日 |  | `dp-moet-prd.cloudsql_imports_views.users` | birth_date |  |  |  |
| sex | STRING | 性別 |  | `dp-moet-prd.cloudsql_imports_views.users` | sex |  |  |  |
| work_style | STRING | 働き方 | NULL固定（2025.04.10に取得不可となったため） | - |  |  |  |  |
| university | STRING | 所属大学 | 医学生の場合のみ | `dp-moet-prd.cloudsql_imports_views.users` | university |  |  |  |
| university_email | STRING | 所属大学のメールアドレス | 医学生の場合のみ | `dp-moet-prd.cloudsql_imports_views.users` | university_email |  |  |  |
| license_expected_year | STRING | 卒業予定年 | 医学生の場合のみ | `dp-moet-prd.cloudsql_imports_views.users` | license_expected_year |  |  |  |
| notification_enabled | BOOLEAN | 通知送付OKかどうか |  | `dp-moet-prd.cloudsql_imports_views.users` | notification_enabled |  |  |  |
| test | BOOLEAN | testユーザーかどうか |  | `beer-qa.data_warehouse.Doctors` | is_test_user |  |  |  |
| employment_type | STRING | ユーザーの勤務形態 | ・病院 - 理事長/院長
・診療所 - 理事長/院長
・病院 - 教授/准教授/診療部長
・病院 - その他
・診療所 - その他 | `dp-moet-prd.cloudsql_imports_views.user_basic_informations` |  |  |  |  |