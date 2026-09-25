import { ModRegistrar } from "cs2/modding";
import { InOptionsScreenContext, ModSearch, OptionPage, useInOptionsScreen, useModPageVisible } from "mod-search";
import { isGameSearchActive, setGameSearchActive } from "mod-search-store";

const OPTIONS_SCREEN = "game-ui/menu/components/options-screen/options-screen.tsx";
const OPTIONS_SEARCH = "game-ui/menu/components/options-screen/options-search.tsx";
const DIVIDER = "game-ui/menu/widgets/divider/divider.tsx";

const register: ModRegistrar = (moduleRegistry) => {
    moduleRegistry.extend(OPTIONS_SCREEN, "OptionsScreen", (OptionsScreen) => (props) => (
        <InOptionsScreenContext.Provider value={true}>
            <OptionsScreen {...props} />
        </InOptionsScreenContext.Provider>
    ));

    const useSearch = moduleRegistry.get(OPTIONS_SEARCH, "useSearch");
    moduleRegistry.override(OPTIONS_SEARCH, "useSearch", (...args: any[]) => {
        const search = useSearch(...args);
        setGameSearchActive(search.isSearching);
        return search;
    });

    moduleRegistry.extend(DIVIDER, "Divider", (Divider) => (props) => {
        const inOptionsScreen = useInOptionsScreen();
        return (
            <>
                <Divider {...props} />
                {inOptionsScreen && <ModSearch />}
            </>
        );
    });

    moduleRegistry.extend(OPTIONS_SCREEN, "MenuItem", (MenuItem) => (props) => {
        const page = props.item as OptionPage;
        const isModPage = page?.builtIn === false && Array.isArray(page.sections);
        const visible = useModPageVisible(page, isModPage && !isGameSearchActive());
        return visible ? <MenuItem {...props} /> : <></>;
    });
};

export default register;
