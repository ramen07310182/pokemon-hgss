
document.addEventListener("DOMContentLoaded", () => {
    const tipsList = document.getElementById("tipsList");
    const tipsItems = Array.from(
        tipsList.querySelectorAll(".tips-item")
    );

    const searchInput = document.getElementById("tipsSearch");
    const clearSearchButton = document.getElementById("clearSearch");
    const categoryButtons = document.querySelectorAll(".category-button");
    const tipsCount = document.getElementById("tipsCount");
    const noResults = document.getElementById("noResults");
    const resetFiltersButton = document.getElementById("resetFilters");

    let selectedCategory = "all";

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFKC")
            .toLocaleLowerCase("ja")
            .trim();
    }

    function getSearchableText(item) {
        return normalizeText([
            item.dataset.search,
            item.querySelector(".tips-title")?.textContent,
            item.querySelector(".tips-subtitle")?.textContent,
            item.querySelector(".tips-content")?.textContent
        ].join(" "));
    }

    function updateTips() {
        const query = normalizeText(searchInput.value);
        let visibleCount = 0;

        tipsItems.forEach(item => {
            const matchesCategory =
                selectedCategory === "all" ||
                item.dataset.category === selectedCategory;

            const matchesSearch =
                query === "" ||
                getSearchableText(item).includes(query);

            const shouldShow = matchesCategory && matchesSearch;

            item.hidden = !shouldShow;

            if (!shouldShow) {
                item.open = false;
            } else {
                visibleCount++;
            }
        });

        tipsCount.textContent = `${visibleCount}件`;
        noResults.hidden = visibleCount !== 0;
        clearSearchButton.hidden = searchInput.value.length === 0;
    }

    // 検索
    searchInput.addEventListener("input", updateTips);

    clearSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        updateTips();
        searchInput.focus();
    });

    // カテゴリ切り替え
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            categoryButtons.forEach(otherButton => {
                const isActive =
                    otherButton === button;

                otherButton.classList.toggle("active", isActive);
                otherButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            updateTips();
        });
    });

    // 検索・カテゴリをリセット
    resetFiltersButton.addEventListener("click", () => {
        searchInput.value = "";
        selectedCategory = "all";

        categoryButtons.forEach(button => {
            const isActive = button.dataset.category === "all";

            button.classList.toggle("active", isActive);
            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        updateTips();
        searchInput.focus();
    });

    // 展開は常に1項目だけにする
    tipsItems.forEach(item => {
        item.addEventListener("toggle", () => {
            if (!item.open || item.hidden) {
                return;
            }

            tipsItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.open) {
                    otherItem.open = false;
                }
            });

            // レイアウトの更新後に、開いた項目の先頭へ移動
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!item.open || item.hidden) {
                        return;
                    }

                    item.scrollIntoView({
                        behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches ? "auto" : "smooth",
                        block: "start"
                    });
                });
            });
        });
    });

    updateTips();
});
