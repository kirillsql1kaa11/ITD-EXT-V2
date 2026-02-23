export const Settings = {
    get(key, defaultValue) {
        return GM_getValue(`itdex_${key}`, defaultValue);
    },
    set(key, value) {
        GM_setValue(`itdex_${key}`, value);
    }
};
