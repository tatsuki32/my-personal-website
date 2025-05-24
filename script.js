document.addEventListener('DOMContentLoaded', () => {
    // --- グローバルナビゲーションとハンバーガーメニュー ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = navList.querySelectorAll('a');

    const toggleNav = () => {
        hamburger.classList.toggle('is-active');
        navList.classList.toggle('is-active');
    };

    hamburger.addEventListener('click', toggleNav);

    // ナビゲーションリンククリックでメニューを閉じる (モバイル時)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('is-active')) {
                toggleNav(); // メニューを閉じる
            }
        });
    });

    // 画面サイズ変更時にメニューを閉じる (モバイルからPCに切り替わった場合)
    let isMobileView = window.innerWidth <= 768; // 初期状態のモバイル判定

    const handleResize = () => {
        const newIsMobileView = window.innerWidth <= 768;
        if (isMobileView && !newIsMobileView) {
            // モバイルビューからデスクトップビューに切り替わった場合
            if (navList.classList.contains('is-active')) {
                toggleNav(); // 開いていたら閉じる
            }
        }
        isMobileView = newIsMobileView; // 状態を更新
    };

    window.addEventListener('resize', handleResize);


    // 現在のページに応じたナビゲーションリンクのハイライト
    const currentPath = window.location.pathname.split('/').pop();
    const currentLangDir = window.location.pathname.split('/')[1]; // ex: "en", "kg", "ru" or empty

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();

        if (currentPath === '' && linkHref === 'index.html') { // ルートURLの場合 (例: example.com/)
            link.classList.add('active-page');
        } else if (currentPath === linkHref) {
            link.classList.add('active-page');
        }
    });

    // --- 言語スイッチャーのハイライト ---
    const langSwitcherLinks = document.querySelectorAll('.lang-switcher a');
    
    langSwitcherLinks.forEach(link => {
        const langCode = link.textContent.toLowerCase();

        if (langCode === 'jp' && (currentLangDir === '' || currentPath === 'index.html' || currentPath === 'blog.html' || currentPath === 'multilingual-journey.html' || currentPath === 'profile.html' || currentPath === 'contact.html')) {
            link.classList.add('active');
        } else if (langCode === currentLangDir) {
            link.classList.add('active');
        }
    });


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
        'classical-japanese': { // データ属性名を変更したためJavaScript側も変更
            poetry: "世の中は　常にもがもな　渚漕ぐ　海人の小舟の　綱手かなしも", // 柿本人麻呂
            colorClass: 'classical-japanese-active'
        }
        // 他の言語もここに追加
    };

    // PC/タブレット: マウスオーバー時のインタラクション
    if (window.innerWidth > 768) {
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
                setTimeout(() => { // 遅延を少し長くして自然に
                    langPoetry.textContent = '';
                    item.classList.remove('is-active');
                    item.classList.remove(languageData[langKey].colorClass);
                }, 250); 
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

    // 多言語奮闘記ページの場合のみObserverを適用
    if (document.getElementById('multilingual-journey-section-id')) {
        languageItems.forEach(item => {
            languageObserver.observe(item);
        });
    }
});