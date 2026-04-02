export type Question = {
	id: number;
	choiceA: string;
	choiceB: string;
};

export const questions: Question[] = [
	{ id: 1, choiceA: '一生Vimのみ', choiceB: '一生VSCodeのみ' },
	{ id: 2, choiceA: 'フロントエンド専門', choiceB: 'バックエンド専門' },
	{ id: 3, choiceA: 'タブ派', choiceB: 'スペース派' },
	{ id: 4, choiceA: 'Mac一択', choiceB: 'Linux一択' },
	{ id: 5, choiceA: '静的型付け言語のみ', choiceB: '動的型付け言語のみ' },
	{ id: 6, choiceA: 'モノリス構成', choiceB: 'マイクロサービス構成' },
	{ id: 7, choiceA: 'RESTful API', choiceB: 'GraphQL' },
	{ id: 8, choiceA: 'ダークモード一択', choiceB: 'ライトモード一択' },
	{ id: 9, choiceA: 'Git rebase派', choiceB: 'Git merge派' },
	{ id: 10, choiceA: 'テストを先に書く(TDD)', choiceB: '実装を先に書く' },
	{ id: 11, choiceA: 'ドキュメントを書く仕事', choiceB: 'コードレビューする仕事' },
	{ id: 12, choiceA: '一生CSS手書き', choiceB: '一生Tailwindのみ' },
	{ id: 13, choiceA: 'SQL直書き', choiceB: 'ORM一択' },
	{ id: 14, choiceA: 'Docker使用禁止', choiceB: 'ローカル環境構築禁止' },
	{ id: 15, choiceA: 'スプリント1週間', choiceB: 'スプリント1ヶ月' },
	{ id: 16, choiceA: '新規プロジェクトだけ', choiceB: 'レガシー改善だけ' },
	{ id: 17, choiceA: 'コードのコメントゼロ', choiceB: 'コメントだらけのコード' },
	{ id: 18, choiceA: 'スタートアップで働く', choiceB: '大企業で働く' },
	{ id: 19, choiceA: '完全リモートワーク', choiceB: '完全オフィス出社' },
	{ id: 20, choiceA: 'PR 1つ1000行', choiceB: 'PR 100個 各10行' },
	{ id: 21, choiceA: 'console.logデバッグ', choiceB: 'デバッガー使用' },
	{ id: 22, choiceA: '英語のドキュメントしかない', choiceB: '日本語だけど情報が古い' },
	{ id: 23, choiceA: 'AI生成コードのみ使用', choiceB: 'AIツール一切禁止' },
	{ id: 24, choiceA: 'NoSQL一択', choiceB: 'RDB一択' },
	{ id: 25, choiceA: 'モニター1枚', choiceB: 'モニター5枚' },
	{ id: 26, choiceA: 'キーボード自作', choiceB: 'トラックパッドのみ' },
	{ id: 27, choiceA: '本番環境に直デプロイ', choiceB: 'ステージング環境5段階' },
	{ id: 28, choiceA: 'エラーハンドリング全部自分で書く', choiceB: 'エラーは全てスルー' },
	{ id: 29, choiceA: '毎日スタンドアップ30分', choiceB: 'MTG一切なし連絡はSlackのみ' },
	{ id: 30, choiceA: '一生同じ言語', choiceB: '毎年新しい言語' }
];
