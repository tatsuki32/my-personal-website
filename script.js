document.addEventListener('DOMContentLoaded', () => {
    // --- 言語切り替えメニューの機能 ---
    const langButton = document.getElementById('langButton');
    const langMenu = document.getElementById('langMenu');

    // ボタンが存在し、メニューが存在するか確認
    if (langButton && langMenu) {
        // ボタンをクリックしたらメニュー表示を切り替える
        langButton.addEventListener('click', (event) => {
            event.stopPropagation(); // イベントの伝播を停止（これがないと、ボタンクリックがdocumentにも伝わってメニューがすぐ閉じる）
            langMenu.classList.toggle('lang-menu-hidden'); // 'lang-menu-hidden' クラスを付け外し
        });

        // メニュー外をクリックしたらメニューを閉じる
        document.addEventListener('click', (event) => {
            // クリックされた要素がボタンでもメニュー内でもない場合
            if (!langButton.contains(event.target) && !langMenu.contains(event.target)) {
                langMenu.classList.add('lang-menu-hidden'); // メニューを非表示にする
            }
        });

        // 現在のページ言語に基づいてボタンのテキストを更新 (オプション)
        const currentLang = document.documentElement.lang.toUpperCase(); // HTMLのlang属性から取得
        const langMap = { // 言語コードと表示名のマッピング
            'JA': 'JP',
            'EN': 'EN',
            'ZOROALI': 'Zoroali',
            'VN': 'VN',
            'ID': 'ID',
            'RU': 'RU',
            'KG': 'KG'
        };
        if (langMap[currentLang]) {
            langButton.textContent = `${langMap[currentLang]} ▼`;
        }
    }

    // --- プロフィールページのコンテンツ切り替え機能 ---
    // about.htmlでのみ実行されるように、bodyに 'about-page' クラスが付いているか確認
    if (document.body.classList.contains('about-page')) {
        const profileNavLinks = document.querySelectorAll('.profile-nav a');
        const profileContents = document.querySelectorAll('.profile-content');

        function showProfileSection(id) {
            // 全てのコンテンツを非表示に
            profileContents.forEach(content => {
                content.style.display = 'none';
            });

            // 指定されたIDのコンテンツを表示
            const targetContent = document.getElementById(id);
            if (targetContent) {
                targetContent.style.display = 'block';
            }

            // 全てのナビリンクのアクティブクラスを解除
            profileNavLinks.forEach(link => {
                link.classList.remove('active');
            });

            // 現在アクティブなナビリンクにクラスを追加
            document.querySelector(`.profile-nav a[href="#${id}"]`).classList.add('active');
        }

        // ナビリンクにクリックイベントを追加
        profileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // リンクのデフォルト動作（ページ内ジャンプ）をキャンセル
                const targetId = e.target.getAttribute('href').substring(1); // "#"を除いたIDを取得
                showProfileSection(targetId);
            });
        });

        // ページ読み込み時に初期表示するセクションを決定
        const initialHash = window.location.hash.substring(1); // URLのハッシュ（#概要など）を取得
        if (initialHash && document.getElementById(initialHash)) {
            // URLにハッシュがあればそのセクションを表示
            showProfileSection(initialHash);
        } else {
            // なければ最初のセクション（概要）を表示
            if (profileContents.length > 0) {
                showProfileSection(profileContents[0].id);
            }
        }
    }

    console.log("TATSUKI.ASIAのJavaScriptが動いています！");
});
// --- 語学リストのホバーで言語名を切り替える機能 ---
document.addEventListener('DOMContentLoaded', () => {
    const langItems = document.querySelectorAll('.language-grid .lang-item');

    if (langItems.length > 0) {
        langItems.forEach(item => {
            const langJpSpan = item.querySelector('.lang-jp');
            const langNativeSpan = item.querySelector('.lang-native');
            const nativeLangText = item.getAttribute('data-lang-native');

            if (langJpSpan && langNativeSpan && nativeLangText) {
                langNativeSpan.textContent = nativeLangText; // ネイティブ表示スパンにテキストを設定

                // ホバー時に切り替え（CSSの切り替えを補助）
                item.addEventListener('mouseenter', () => {
                    langJpSpan.style.opacity = '0';
                    langJpSpan.style.transform = 'translateY(-5px)';
                    langNativeSpan.style.opacity = '1';
                    langNativeSpan.style.transform = 'translateY(0)';
                });

                item.addEventListener('mouseleave', () => {
                    langJpSpan.style.opacity = '1';
                    langJpSpan.style.transform = 'translateY(0)';
                    langNativeSpan.style.opacity = '0';
                    langNativeSpan.style.transform = 'translateY(5px)';
                });
            }
        });
    }
});

// --- ハンバーガーメニューの機能 ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const globalNav = document.getElementById('globalNav');
    const body = document.body;

    if (hamburgerButton && globalNav && body) { // 要素が存在するか確認
        hamburgerButton.addEventListener('click', () => {
            globalNav.classList.toggle('is-open'); // メニューの表示/非表示を切り替えるクラス
            hamburgerButton.classList.toggle('is-active'); // ハンバーガーアイコンのアニメーション用クラス
            body.classList.toggle('menu-open-overlay'); // メニュー表示時の背景オーバーレイ用クラス
        });

        // メニューリンククリック時や、メニュー外クリック時にメニューを閉じる
        globalNav.addEventListener('click', (event) => {
            // メニュー内のリンクがクリックされた場合のみ閉じる
            if (event.target.tagName === 'A') {
                globalNav.classList.remove('is-open');
                hamburgerButton.classList.remove('is-active');
                body.classList.remove('menu-open-overlay');
            }
        });

        // 言語切り替えメニューが開いているときにメニュー外をクリックしたら閉じる（既存の機能の強化）
        const langButton = document.getElementById('langButton');
        const langMenu = document.getElementById('langMenu');
        if (langButton && langMenu) {
            document.addEventListener('click', (event) => {
                if (!langButton.contains(event.target) && !langMenu.contains(event.target) && !hamburgerButton.contains(event.target) && !globalNav.contains(event.target)) {
                    // 他のメニュー要素をクリックしていない場合にのみ言語メニューを閉じる
                    langMenu.classList.add('lang-menu-hidden');
                }
            });
        }
    }
});