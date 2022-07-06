Works only with Expo managed react native projects. Checks If there is any update to the playstore/ appstore and specifies the store urls along with some other info besides notifying about the update. This is useful when the native code is updated and a new apk or ipa is submitted to stores, else If you want updates only for js or static files you can go with Expo OTA Updates given with both `EAS builds` & `expo publish` or without expo you can explore more on CodePush (https://appcenter.ms).

## Methods
- `storeUpdateStatus` - returns an object of type StoresUpdatesStatus containing info about the update and If should be redirected to playstore/appstore or not along with the links

## Types
```
StoresUpdatesStatus- {
      isUpdateAvailable: boolean,
        storeUrl: string,
        appName: string,
        bundleId: string,
        currentVersion: string,
        storeVersion: string
}
```

## Usage
```
import { storeUpdateStatus } from 'rn-stores-updates-expo';

storeUpdateStatus().then(updateStatus => {
                if (updateStatus?.isUpdateAvailable) {
                  //do something like showing alert
                  Linking.openURL(updateStatus.storeUrl);
                }
      }
```