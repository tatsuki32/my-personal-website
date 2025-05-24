document.addEventListener('DOMContentLoaded', () => {
    // --- グローバルナビゲーションとハンバーガーメニュー ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const overlay = document.querySelector('.overlay'); // オーバーレイ要素を取得

    const toggleNav = () => {
        hamburger.classList.toggle('is-active');
        navList.classList.toggle('is-active');
        overlay.classList.toggle('is-active'); // オーバーレイの表示/非表示も切り替え
        document.body.classList.toggle('no-scroll'); // 背景のスクロールを禁止
    };

    hamburger.addEventListener('click', toggleNav);
    overlay.addEventListener('click', toggleNav); // オーバーレイクリックで閉じる

    // ナビゲーションリンククリックでメニューを閉じる (モバイル時)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('is-active')) {
                toggleNav(); // メニューを閉じる
            }
        });
    });

    // --- モバイル版言語スイッチャー ---
    const langSwitcherToggle = document.querySelector('.lang-switcher-toggle');
    const langSwitcherDropdown = document.querySelector('.lang-switcher-dropdown');

    if (langSwitcherToggle && langSwitcherDropdown) {
        langSwitcherToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // クリックイベントの伝播を停止
            langSwitcherDropdown.classList.toggle('is-active');
            // 必要であれば、言語ドロップダウンが開いたらオーバーレイも表示する
            // overlay.classList.toggle('is-active'); 
            // document.body.classList.toggle('no-scroll');
        });

        // ドロップダウン外をクリックで閉じる
        document.addEventListener('click', (event) => {
            if (!langSwitcherDropdown.contains(event.target) && langSwitcherDropdown.classList.contains('is-active')) {
                langSwitcherDropdown.classList.remove('is-active');
                // if (!navList.classList.contains('is-active')) { // ハンバーガーメニューが開いてない時だけスクロール許可
                //     document.body.classList.remove('no-scroll');
                // }
            }
        });

        // ドロップダウン内のリンククリックで閉じる
        langSwitcherDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                langSwitcherDropdown.classList.remove('is-active');
                // if (!navList.classList.contains('is-active')) {
                //     document.body.classList.remove('no-scroll');
                // }
            });
        });
    }

    // --- 現在のページに応じたナビゲーションリンクのハイライト ---
    const currentPath = window.location.pathname.split('/').pop();
    const currentLangDir = window.location.pathname.split('/')[1];

    navList.querySelectorAll('a').forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();

        if (currentPath === 'index.html' && linkHref === 'index.html') {
            link.classList.add('active-page');
        } else if (currentPath === '' && linkHref === 'index.html' && currentLangDir === '') { // ルートURLのJP版
             link.classList.add('active-page');
        }
        else if (linkHref !== 'index.html' && currentPath === linkHref) {
            link.classList.add('active-page');
        }
    });

    // --- 言語スイッチャーのハイライト ---
    const langSwitcherLinks = document.querySelectorAll('.lang-switcher a');
    const langSwitcherDropdownLinks = document.querySelectorAll('.lang-switcher-dropdown a');
    
    const highlightLangLink = (links) => {
        links.forEach(link => {
            const langCode = link.textContent.toLowerCase();

            if (langCode === 'jp' && (currentLangDir === '' || currentPath === 'index.html')) {
                link.classList.add('active');
            } else if (langCode === currentLangDir) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    highlightLangLink(langSwitcherLinks);
    highlightLangLink(langSwitcherDropdownLinks);


    // --- 多言語奮闘記セクションのインタラクション ---
    const languageItems = document.querySelectorAll('.language-item');

    const languageData = {
        english: {
            poetry: "Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference.", // Robert Frost
            colorClass: 'english-active'
        },
        russian: {
            poetry: "Я вас любил: любовь ещё, быть может, В душе моей угасла не совсем.", // Александр Пушкин
            colorClass: 'russian-active'
        },
        kyrgyz: {
            poetry: "Кыргыз жери – алтын бешик, Кыргызым – кайнар булак.", // (キルギスの詩の例 - 適切なものに置き換えてください)
            colorClass: 'kyrgyz-active'
        },
        'japanese-classical': {
            poetry: "世の中は　常にもがもな　渚漕ぐ　海人の小舟の　綱手かなしも", // 柿本人麻呂
            colorClass: 'japanese-classical-active'
        }
        // 他の言語もここに追加
    };

    // PC/タブレット: マウスオーバー時のインタラクション
    if (window.innerWidth > 768) { // 768px以上をPC/タブレットと判断
        languageItems.forEach(item => {
            const langKey = item.dataset.lang;
            const langPoetry = item.querySelector('.lang-poetry');

            item.addEventListener('mouseenter', () => {
                if (languageData[langKey]) {
                    langPoetry.textContent = languageData[langKey].poetry;
                    item.classList.add('is-active');
                    item.classList.add(languageData[langKey].colorClass);
                }
            });

            item.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    item.classList.remove('is-active');
                    item.classList.remove(languageData[langKey].colorClass);
                    langPoetry.textContent = ''; // 詩をクリア
                }, 200); // 200msの遅延
            });
        });
    }

    // スマートフォン: スクロール時のインタラクション (Intersection Observer APIを使用)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const languageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const item = entry.target;
            const langKey = item.dataset.lang;
            const langPoetry = item.querySelector('.lang-poetry');
            
            if (languageData[langKey]) {
                langPoetry.textContent = languageData[langKey].poetry; // モバイルでは常に詩を設定
            }

            if (entry.isIntersecting) {
                item.classList.add('is-active');
                if (languageData[langKey]) {
                    item.classList.add(languageData[langKey].colorClass);
                }
            } else {
                item.classList.remove('is-active');
                if (languageData[langKey]) {
                    item.classList.remove(languageData[langKey].colorClass);
                }
            }
        });
    }, observerOptions);

    if (document.getElementById('multilingual-journey-section-id')) { // IDを追加
        languageItems.forEach(item => {
            languageObserver.observe(item);
        });
    }

    // --- 背景スクロール禁止用のクラス ---
    // CSSで body.no-scroll { overflow: hidden; } を追加
});