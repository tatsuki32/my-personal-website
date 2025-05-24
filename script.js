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
    const langSwitcherCloseButton = document.querySelector('.lang-switcher-close-button'); // 追加

    if (langSwitcherToggle && langSwitcherDropdown) {
        langSwitcherToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // クリックイベントの伝播を停止（bodyクリックで閉じないように）
            langSwitcherDropdown.classList.toggle('is-active');

            // 言語ドロップダウンが開いたらハンバーガーメニューを閉じる
            if (langSwitcherDropdown.classList.contains('is-active') && navList.classList.contains('is-active')) {
                toggleNav(); // ハンバーガーメニューを閉じる
            }
            // 言語ドロップダウンが開いたらオーバーレイも表示する (任意)
            overlay.classList.toggle('is-active', langSwitcherDropdown.classList.contains('is-active'));
            document.body.classList.toggle('no-scroll', langSwitcherDropdown.classList.contains('is-active'));
        });

        // 言語ドロップダウンの閉じるボタン
        if (langSwitcherCloseButton) {
            langSwitcherCloseButton.addEventListener('click', () => {
                langSwitcherDropdown.classList.remove('is-active');
                overlay.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
            });
        }

        // ドロップダウン外をクリックで閉じる (ハンバーガーメニューと同時開閉は考慮しない)
        document.addEventListener('click', (event) => {
            if (!langSwitcherDropdown.contains(event.target) && !langSwitcherToggle.contains(event.target) && langSwitcherDropdown.classList.contains('is-active')) {
                langSwitcherDropdown.classList.remove('is-active');
                overlay.classList.remove('is-active');
                document.body.classList.remove('no-scroll'); // オーバーレイを閉じた時もスクロール許可
            }
        });

        // ドロップダウン内のリンククリックで閉じる
        langSwitcherDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                langSwitcherDropdown.classList.remove('is-active');
                overlay.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
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
            // iframe.srcにYOUR_VIDEO_IDが入っている前提
            const youtubeIdMatch = iframe.src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : null;

            if (youtubeId) {
                iframe.src = `http://www.youtube.com/embed/${youtubeId}?autoplay=1`;
                this.classList.add('playing'); // playingクラスを追加して動画を表示
            } else {
                console.error("YouTube video ID not found in iframe src.");
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (既存のナビゲーション、言語スイッチャー、多言語奮闘記インタラクションのコード) ...

    // --- 取材履歴の動的生成 ---
    const mediaArticlesData = [
        // 各記事のデータ (URL, タイトル, 概要) をここに追加してください
        // サムネイルは自動取得できないため、ここでは画像は指定しません。
        // タイトルと概要は手動で入力してください。
          {
            url: "https://prtimes.jp/main/html/rd/p/000000004.000073331.html",
            title: "株式会社Unpacked iU情報経営イノベーション専門職大学と「次世代の教育推進」を目的として連携",
        },

         {
            url: "https://prtimes.jp/main/html/rd/p/000000003.000073331.html",
            title: "Unpacked×テレビ東京コミュニケーションズ　共同事業としてU18キャリアサミットの開催を決定",
            
        },

         {
            url: "https://kininarukotomatome.com/u18-career-summit-c0514/",
            title: "【第2弾：なんとなくから卒業だ】U18キャリアサミット",
        },

         {
            url: "https://aoaoi.jp/news/post-20166/",
            title: "日本最大級キャリアイベント『U18キャリアサミット』の公式サポーターになりました！",
        },
         {
            url: "https://www.winkey.co.jp/single-post/ch210620",
            title: "chFILES 6月号 ",
            description: " [社長に会いたい]のコーナーで取材をしていただきました。"
        },
         {
            url: "https://dwango.co.jp/news/5914067370593441947/",
            title: "起業部法人登記第6号誕生中高生向けのキャリア教育支援事業「株式会社 Unpacked」高校生が高校生に未知なる発見や学びを提供",
            description: "ドワンゴさまに掲載いただきました。"
        },

         {
            url: "https://note.com/e0712004/n/n70745935ec79",
            title: "思いを形にする",
            description: "逗子市立逗子小学校教員の高司先生に取材いただきました。"
        },
       
         {
            url: "https://u-29.com/2020/10/15/tatsuki_mitsuhashi/",
            title: "「明日を楽しみに夜眠る人を増やす」 同世代に寄り添うN高生社長・三橋龍起の志",
            description: "「U-29ドットコム」さまに取材いただきました。"
        },
       
         {
            url: "https://www.youtube.com/watch?v=DHGabSyQT5Y&ab_channel=%E5%BF%97%E6%95%99%E8%82%B2%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88",
            title: "第二回世界青少年志プレゼンテーション大会ファイナリスト「三橋龍動画」",
            description: "第二回世界青少年志プレゼンテーション大会ファイナリストに選抜いただきました。"
        },
       
          {
            url: "https://coki.jp/",
            title: "Amazon、Nikeとも協働。高校生の可能性を最大限に【株式会社 Unpacked】｜coki",
            description: "株式会社 Unpackedの活動に関するCokiでのインタビュー記事です。"
        },

          {
            url: "https://coki.jp/",
            title: "Amazon、Nikeとも協働。高校生の可能性を最大限に【株式会社 Unpacked】｜coki",
            description: "株式会社 Unpackedの活動に関するCokiでのインタビュー記事です。"
        },

          {
            url: "https://coki.jp/",
            title: "Amazon、Nikeとも協働。高校生の可能性を最大限に【株式会社 Unpacked】｜coki",
            description: "株式会社 Unpackedの活動に関するCokiでのインタビュー記事です。"
        },

          {
            url: "https://coki.jp/",
            title: "Amazon、Nikeとも協働。高校生の可能性を最大限に【株式会社 Unpacked】｜coki",
            description: "株式会社 Unpackedの活動に関するCokiでのインタビュー記事です。"
        },
       
        {
            url: "https://coki.jp/",
            title: "Amazon、Nikeとも協働。高校生の可能性を最大限に【株式会社 Unpacked】｜coki",
            description: "株式会社 Unpackedの活動に関するCokiでのインタビュー記事です。"
        },
        {
            url: "https://u-29.com/",
            title: "「明日を楽しみに夜眠る人を増やす」 同世代に寄り添うN高生社長・三橋龍起の志 | U-29.com",
            description: "U-29.comでの深掘りインタビュー記事。"
        },
        {
            url: "https://shonan100.org/",
            title: "夜寝るときに、明日が楽しみと思える人を1人でも増やしたい—16歳が切り拓く“自分の道”、その志。 | 湘南ワンハンドレッドプロジェクト",
            description: "湘南100クラブでのインタビュー記事です。"
        },
        {
            url: "https://www.watch.impress.co.jp/",
            title: "人生を切り拓く！N高卒業生と起業部が語る、事業と社会変革のアイディア——プレゼンテーションイベント「NED2020」レポート後編",
            description: "プレゼンテーションイベント「NED2020」に関するレポート記事。"
        },
        {
            url: "https://news.line.me/",
            title: "「一番の問題は環境問題」ノーベル平和賞受賞者ムハマド・ユヌス氏が日本の高校生と意見を交わす (BLOGOS)",
            description: "ムハマド・ユヌス氏との対談記事。"
        },
        {
            url: "https://u29-141.peatix.com/",
            title: "【Vol.140】ユニキャリ by 父の死→N高に転校→起業を目指す！三橋龍起さんに聞く「自分で切り拓く人生論」とは",
            description: "ユニークな価値観を持つ29歳以下の世代（U-29世代）のためのコミュニティ「ユニキャリ」でのインタビュー。"
        },
        {
            url: "https://dwango.co.jp/",
            title: "起業部法人登記第6号誕生中高生向けのキャリア教育支援事業「株式会社 Unpacked」高校生が高校生に未知なる発見や学びを提供|株式会社ドワンゴ",
            description: "株式会社Unpacked設立に関するドワンゴのプレスリリース。"
        },
        {
            url: "https://www.unpacked-inc.com/",
            title: "株式会社Unpacked ホームページ",
            description: "私が創業した会社(株式会社Unpacked）のホームページです。"
        },
        {
            url: "https://www.u18career.com/",
            title: "U18キャリアサミット 公式HP",
            description: "事業の1つ（U18CareerSummit）特設ページです。"
        },
        // 20〜30件ある取材記事のURLとタイトル、概要をここに追加してください
        // 例：
        // {
        //     url: "https://example.com/another-interview-article",
        //     title: "新しいインタビュー記事のタイトル",
        //     description: "この記事の簡単な説明文です。"
        // },
        // ... (ここに続けて追加)
    ];

    const mediaArticlesContainer = document.getElementById('media-articles-container');

    if (mediaArticlesContainer) {
        mediaArticlesData.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.classList.add('media-article-item');
            
            // サムネイルは削除し、タイトルと説明、リンクのみを生成
            articleItem.innerHTML = `
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                </a>
            `;
            mediaArticlesContainer.appendChild(articleItem);
        });
    }

    // ... (既存のYouTubeサムネイル再生ロジックのコード) ...
});