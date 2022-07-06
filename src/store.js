import axios from 'axios';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

//Note: If running this code in Expo Go app, all the details below will be of expo go app

const getAppBundleName = () => {
    return Application.applicationId;
}

const getAppVersion = () => {
    return Application.nativeApplicationVersion;
}

const getAppName = () => {
    return Application.applicationName;
}

const getAppStoreVersionAndTrackId = async () => {
    try {
        const iTunesData = await axios.get(`https://itunes.apple.com/lookup?bundleId=${getAppBundleName()}&date=${new Date().getTime()}`);
        if (iTunesData?.data?.results?.length) {
            return [iTunesData.data.results[0].version, iTunesData.data.results[0].trackId];
        }
        return [null, null];
    } catch (err) {
        console.error(err);
        return [null, null];
    }
}

//TODO: temporary fix to fetch the latest version of app in playstore
const getPlayStoreVersionAndBundleId = async () => {
    try {
        const playStoreData = await axios.get(`https://play.google.com/store/apps/details?id=${getAppBundleName()}&hl=en`);
        if (playStoreData.data) {
            const regexMatcher = (playStoreData.data).match(/\[\[\["([\d.]+?)"\]\]/);
            if (regexMatcher.length >= 1) {
                return [regexMatcher[1].trim(), getAppBundleName()];
            }
        }
        return [null, null];
    } catch (err) {
        console.error(err);
        return [null, null];
    }
}

const getStoreVersionAndUrl = () => {
    switch (Platform.OS) {
        case 'ios': {
            return getAppStoreVersionAndTrackId();
        }
        case 'android': {
            return getPlayStoreVersionAndBundleId();
        }
    }
}

const getStoreLink = (referenceId) => {
    switch (Platform.OS) {
        case 'ios': {
            return `itms-apps://apps.apple.com/app/id/${referenceId}`;
        }
        case 'android': {
            return `https://play.google.com/store/apps/details?id=${referenceId}&hl=en`;
        }
    }
}

export const storeUpdateStatus = async () => {
    const [storeVersion, referenceId] = await getStoreVersionAndUrl();
    const currentVersion = getAppVersion();
    return {
        isUpdateAvailable: currentVersion && storeVersion && (currentVersion < storeVersion),
        storeUrl: getStoreLink(referenceId),
        appName: getAppName(),
        bundleId: getAppBundleName(),
        currentVersion,
        storeVersion
    };
}