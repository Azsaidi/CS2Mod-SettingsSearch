import { ChangeEvent, createContext, useContext, useMemo } from "react";
import { getModule } from "cs2/modding";
import { Localization, useLocalization } from "cs2/l10n";
import { FOCUS_DISABLED } from "cs2/input";
import classNames from "classnames";
import { setModSearchQuery, useModSearchQuery } from "mod-search-store";
import styles from "./mod-search.module.scss";

export const MIN_QUERY_LENGTH = 2;

const TextInput = getModule("game-ui/common/input/text/text-input.tsx", "TextInput");
const IconButton = getModule("game-ui/common/input/button/icon-button.tsx", "IconButton");
const useTextInputTheme = getModule("game-ui/common/input/text/ellipsis-text-input/ellipsis-text-input-theme.tsx", "useTextInputTheme");
const renderLocalized = getModule("game-ui/common/localization/localized.tsx", "renderLocalized");
const searchClasses = getModule("game-ui/menu/components/options-screen/options-search.module.scss", "classes");

const CLEAR_ICON = "Media/Glyphs/Clear.svg";

export const InOptionsScreenContext = createContext(false);

export interface OptionItem {
    id: string;
    displayName: any;
    searchHidden?: boolean;
}

export interface OptionPage {
    id: string;
    builtIn: boolean;
    sections: { id: string; items: OptionItem[] }[];
}

const localize = (localization: Localization, value: any): string => {
    try {
        return renderLocalized(localization, value) ?? "";
    } catch {
        return value?.value ?? "";
    }
};

export const pageMatches = (localization: Localization, page: OptionPage, query: string) => {
    const needle = query.trim().toLowerCase();
    const name = localization.translate(`Options.SECTION[${page.id}]`) ?? page.id;
    if (name.toLowerCase().includes(needle)) return true;
    return page.sections.some((section) =>
        section.items.some((item) => !item.searchHidden && localize(localization, item.displayName).toLowerCase().includes(needle))
    );
};

export const useModPageVisible = (page: OptionPage, active: boolean) => {
    const localization = useLocalization();
    const query = useModSearchQuery();
    return useMemo(
        () => !active || query.trim().length < MIN_QUERY_LENGTH || pageMatches(localization, page, query),
        [active, query, page, localization]
    );
};

export const ModSearch = () => {
    const query = useModSearchQuery();
    const theme = useTextInputTheme();

    return (
        <div className={styles.modSearch}>
            <TextInput
                focusKey={FOCUS_DISABLED}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setModSearchQuery(e.target.value)}
                vkTitle="Search mods"
                placeholder="Search mods..."
                className={classNames(theme.input, searchClasses.searchInput, styles.input)}
            />
            {query && (
                <IconButton
                    tinted
                    focusKey={FOCUS_DISABLED}
                    src={CLEAR_ICON}
                    className={searchClasses.searchInputClear}
                    onSelect={() => setModSearchQuery("")}
                />
            )}
        </div>
    );
};

export const useInOptionsScreen = () => useContext(InOptionsScreenContext);
