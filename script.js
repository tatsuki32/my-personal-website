document.addEventListener('DOMContentLoaded', () => {
    // --- グローバルナビゲーションとハンバーガーメニュー ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = navList.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active');
        navList.classList.toggle('is-active');
    });

    // ナビゲーションリンククリックでメニューを閉じる (モバイル時)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('is-active')) {
                hamburger.classList.remove('is-active');
                navList.classList.remove('is-active');
            }
        });
    });

    // 現在のページに応じたナビゲーションリンクのハイライト
    const currentPagePath = window.location.pathname;
    navLinks.forEach(link => {
        // 例: /blog.html は "日記"、/multilingual-journey.html は "多言語奮闘記"
        if (currentPagePath.includes(link.getAttribute('href').replace('#', '/'))) {
            link.classList.add('active-page');
        } else if (currentPagePath === '/' || currentPagePath.includes('/index.html') && link.getAttribute('href') === '#home') {
            link.classList.add('active-page');
        }
    });

    // --- 言語スイッチャーのハイライト ---
    const langSwitcherLinks = document.querySelectorAll('.lang-switcher a');
    const currentLang = window.location.pathname.split('/')[1]; // URLパスの最初の部分 (en, kg, ru など)

    langSwitcherLinks.forEach(link => {
        const langCode = link.textContent.toLowerCase(); // JP, EN, KG, RU

        if (langCode === 'jp' && currentLang === '') { // 日本語版はルート
            link.classList.add('active');
        } else if (langCode === currentLang) {
            link.classList.add('active');
        }
    });


    // --- 多言語奮闘記セクションのインタラクション ---
    const languageItems = document.querySelectorAll('.language-item');

    // 各言語に関する詩/フレーズデータ
    const languageData = {
        english: {
            poetry: "Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.", // Robert Frost
            colorClass: 'english-active' // CSSで定義するクラス
        },
        russian: {
            poetry: "Я вас любил: любовь ещё, быть может, В душе моей угасла не совсем.", // Александр Пушкин
            colorClass: 'russian-active'
        },
        kyrgyz: {
            poetry: "Кыргыз жери – алтын бешик, Кыргызым – кайнар булак.", // (キルギスの詩の例 - 適切なものに置き換えてください)
            colorClass: 'kyrgyz-active'
        },
        // 他の言語もここに追加
    };

    // PC/タブレット: マウスオーバー時のインタラクション
    if (window.innerWidth > 768) { // 768px以上をPC/タブレットと判断
        languageItems.forEach(item => {
            const langKey = item.dataset.lang;
            const langDisplay = item.querySelector('.lang-display');
            const langPoetry = item.querySelector('.lang-poetry');

            item.addEventListener('mouseenter', () => {
                if (languageData[langKey]) {
                    langPoetry.textContent = languageData[langKey].poetry;
                    item.classList.add('is-active'); // 色と詩の表示を制御するクラス
                    item.classList.add(languageData[langKey].colorClass); // 各言語固有の色クラス
                }
            });

            item.addEventListener('mouseleave', () => {
                langPoetry.textContent = ''; // 詩をクリア
                item.classList.remove('is-active');
                item.classList.remove(languageData[langKey].colorClass);
            });
        });
    }

    // スマートフォン: スクロール時のインタラクション (Intersection Observer APIを使用)
    // モバイルでは常に詩が表示されるようにCSSで設定済みのため、ここではクラスの付与のみ。
    // クラスを付与することで、各言語固有の背景色・テキスト色が適用される
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // 要素の50%が見えたら発火
    };

    const languageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const langKey = item.dataset.lang;
                if (languageData[langKey]) {
                    item.classList.add('is-active'); // スマホでは常にactiveに
                    item.classList.add(languageData[langKey].colorClass);
                }
            } else {
                // オプション：ビューポートから外れたら元に戻す場合 (今回はスマホでは常にactiveなので不要かも)
                // const item = entry.target;
                // const langKey = item.dataset.lang;
                // if (languageData[langKey]) {
                //     item.classList.remove('is-active');
                //     item.classList.remove(languageData[langKey].colorClass);
                // }
            }
        });
    }, observerOptions);

    // 多言語奮闘記ページの場合のみObserverを適用
    if (document.getElementById('multilingual-journey')) {
        languageItems.forEach(item => {
            languageObserver.observe(item);
        });
    }
});