document.addEventListener('DOMContentLoaded', () => {
    // --- グローバルナビゲーションとハンバーガーメニュー ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const overlay = document.querySelector('.overlay');

    const toggleNav = () => {
        hamburger.classList.toggle('is-active'); // X印アニメーション
        navList.classList.toggle('is-active'); // メニューのスライド
        overlay.classList.toggle('is-active'); // オーバーレイの表示
        document.body.classList.toggle('no-scroll'); // 背景のスクロール禁止
        
        // ハンバーガーメニューが開いたら言語ドロップダウンを閉じる
        if (navList.classList.contains('is-active') && langSwitcherDropdown.classList.contains('is-active')) {
            langSwitcherDropdown.classList.remove('is-active');
        }
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
            event.stopPropagation(); // クリックイベントの伝播を停止（bodyクリックで閉じないように）
            langSwitcherDropdown.classList.toggle('is-active');

            // 言語ドロップダウンが開いたらハンバーガーメニューを閉じる
            if (langSwitcherDropdown.classList.contains('is-active') && navList.classList.contains('is-active')) {
                toggleNav(); // ハンバーガーメニューを閉じる
            }
            // 言語ドロップダウンが開いたらオーバーレイも表示する (任意)
            // overlay.classList.add('is-active'); // 言語ドロップダウンを開いた時にもオーバーレイを表示したい場合
            // document.body.classList.add('no-scroll'); // 言語ドロップダウンが開いた時にもスクロールを禁止したい場合
        });

        // ドロップダウン外をクリックで閉じる (ハンバーガーメニューと同時開閉は考慮しない)
        document.addEventListener('click', (event) => {
            if (!langSwitcherDropdown.contains(event.target) && !langSwitcherToggle.contains(event.target) && langSwitcherDropdown.classList.contains('is-active')) {
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


    // --- 現在のページに応じたナビゲーションリンクのハイライト (既存のコード) ---
    const currentPath = window.location.pathname.split('/').pop();
    const currentLangDir = window.location.pathname.split('/')[1];

    navList.querySelectorAll('a').forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();

        if (currentPath === 'index.html' && linkHref === 'index.html') {
            link.classList.add('active-page');
        } else if (currentPath === '' && linkHref === 'index.html' && currentLangDir === '') {
             link.classList.add('active-page');
        }
        else if (linkHref !== 'index.html' && currentPath === linkHref) {
            link.classList.add('active-page');
        }
    });

    // --- 言語スイッチャーのハイライト (既存のコード) ---
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


    // --- 多言語奮闘記セクションのインタラクション (既存のコード) ---
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
                setTimeout(() => {
                    item.classList.remove('is-active');
                    item.classList.remove(languageData[langKey].colorClass);
                    langPoetry.textContent = '';
                }, 200);
            });
        });
    }

    // スマートフォン: スクロール時のインタラクション
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
                langPoetry.textContent = languageData[langKey].poetry;
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

    if (document.getElementById('multilingual-journey-section-id')) {
        languageItems.forEach(item => {
            languageObserver.observe(item);
        });
    }

    // --- YouTubeサムネイル再生ロジック ---
    const youtubeThumbnailWrapper = document.querySelector('.youtube-thumbnail-wrapper');
    if (youtubeThumbnailWrapper) {
        youtubeThumbnailWrapper.addEventListener('click', function() {
            // iframeのsrc属性からautoplay=1を追加
            const iframe = this.querySelector('iframe');
            const youtubeId = iframe.src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
            iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
            this.classList.add('playing'); // playingクラスを追加して動画を表示
        });
    }
});