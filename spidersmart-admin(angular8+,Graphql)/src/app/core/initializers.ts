import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permission, AlertDialogComponent } from '@spidersmart/ng';
import { UserContext } from './interfaces/user-context.interface';
import { AppContextService } from './services/app-context.service';
import { Context } from './enums/context.enum';
import { CookieService } from 'ngx-cookie-service';

/**
 * Run before the app starts to complete required initialization steps
 * @param http Http service to access authentication
 * @param appContextService Application context service to access context properties
 * @return The initialization function
 * @ignore
 */
export function initializeAuthentication(http: HttpClient, appContextService: AppContextService, cookieService: CookieService) {
    return () => {
        // if authorization is on, load details based on existing token, or send to login if invalid
        if (appContextService.getEnvironmentVariable('useAuthorization')) {
            // if there is no token
            if (!cookieService.check('auth')) {
                window.location.href = appContextService.getEnvironmentVariable('authUrl');
            }
            const token = cookieService.get('auth');
            const headers = new HttpHeaders().set('authorization', token);

            return http.get(appContextService.getEnvironmentVariable('apiUrl').replace('graphql', 'user-context'), { headers })
                .toPromise()
                .then((response: UserContext) => {
                    appContextService.setContextLoadResponse(200);
                    if (response) {
                        appContextService.setUserId(response.id);
                        appContextService.setUserImpersonated(response.isImpersonating);
                        response.permissions.forEach(permission => {
                            appContextService.addPermission(permission as Permission);
                        });
                        response.centers.forEach(center => {
                            appContextService.addAccessibleCenter(center);
                        });
                    }
                    appContextService.setContext(Context.CENTERS);
                    appContextService.setCenter(null);
                    appContextService.printAppContext();
                })
                .catch(error => {
                    appContextService.setContextLoadResponse(error.status);
                });
        } else {
            // if useAuthorization is turned off - just set dummy permissions and centers
            const denyPermissions = []; // [ Permission.VIRTUAL_ACCESS ];

            appContextService.setUserId(1);
            for (const permission in Permission) {
                if (permission && !denyPermissions.includes(Permission[permission])) {
                    appContextService.addPermission(Permission[permission] as Permission);
                }                
            }

            // set center details
            appContextService.addAccessibleCenter({
                id: 1,
                label: 'tysons-corner',
                name: 'Tysons Corner',
                subjects: [
                    {
                        id: 1,
                        name: 'Reading and Writing',
                        levels: [
                            { id: 5, name: '1' },
                            { id: 6, name: '2' },
                            { id: 7, name: '3' },
                            { id: 8, name: '4' },
                            { id: 9, name: '5' },
                            { id: 10, name: '6' },
                            { id: 11, name: '7' },
                            { id: 12, name: '8' },
                            { id: 13, name: '9' },
                            { id: 14, name: '10' },
                            { id: 15, name: '11' },
                            { id: 16, name: '12' }
                        ],
                        hasBooks: true,
                        hasArticles: false,
                        dateFrom: null
                    },
                    {
                        id: 6,
                        name: 'Current Events',
                        levels: [
                            { id: 69, name: '2' },
                            { id: 70, name: '3-4' },
                            { id: 72, name: '5-6' },
                            { id: 73, name: '7-8' },
                            { id: 71, name: '9-12' }
                        ],
                        hasBooks: false,
                        hasArticles: true,
                        dateFrom: null
                    },
                    {
                        id: 2,
                        name: 'Math',
                        levels: [
                            { id: 20, name: '1' },
                            { id: 21, name: '2' },
                            { id: 22, name: '3' },
                            { id: 23, name: '4' },
                            { id: 24, name: '5' },
                            { id: 25, name: '6' },
                            { id: 26, name: '7' },
                            { id: 27, name: '8' },
                            { id: 28, name: '1A' },
                            { id: 29, name: '2A' },
                            { id: 30, name: '3A' },
                            { id: 31, name: '4A' },
                            { id: 32, name: '5A' },
                            { id: 33, name: '6A' },
                            { id: 34, name: '7A' },
                            { id: 35, name: '8A' },
                            { id: 111, name: 'K' },
                            { id: 64, name: '9' },
                            { id: 45, name: 'Algebra' },
                        ],
                        hasBooks: false,
                        hasArticles: false,
                        dateFrom: null
                    }
                ]
            });
            appContextService.addAccessibleCenter({
                id: 2,
                label: 'gaithersburg',
                name: 'Gaithersburg',
                subjects: [
                    {
                        id: 1,
                        name: 'Reading and Writing',
                        levels: [
                            { id: 5, name: '1' },
                            { id: 6, name: '2' },
                            { id: 7, name: '3' },
                            { id: 8, name: '4' },
                            { id: 9, name: '5' },
                            { id: 10, name: '6' },
                            { id: 11, name: '7' },
                            { id: 12, name: '8' },
                            { id: 13, name: '9' },
                            { id: 14, name: '10' },
                            { id: 15, name: '11' },
                            { id: 16, name: '12' }
                        ],
                        hasBooks: true,
                        hasArticles: false,
                        dateFrom: null
                    },
                    {
                        id: 6,
                        name: 'Current Events',
                        levels: [
                            { id: 69, name: '2' },
                            { id: 70, name: '3-4' },
                            { id: 72, name: '5-6' },
                            { id: 73, name: '7-8' },
                            { id: 71, name: '9-12' }
                        ],
                        hasBooks: false,
                        hasArticles: true,
                        dateFrom: null
                    },
                    {
                        id: 2,
                        name: 'Math',
                        levels: [
                            { id: 20, name: '1' },
                            { id: 21, name: '2' },
                            { id: 22, name: '3' },
                            { id: 23, name: '4' },
                            { id: 24, name: '5' },
                            { id: 25, name: '6' },
                            { id: 26, name: '7' },
                            { id: 27, name: '8' },
                            { id: 28, name: '1A' },
                            { id: 29, name: '2A' },
                            { id: 30, name: '3A' },
                            { id: 31, name: '4A' },
                            { id: 32, name: '5A' },
                            { id: 33, name: '6A' },
                            { id: 34, name: '7A' },
                            { id: 35, name: '8A' },
                            { id: 111, name: 'K' },
                            { id: 64, name: '9' },
                            { id: 45, name: 'Algebra' },
                        ],
                        hasBooks: false,
                        hasArticles: false,
                        dateFrom: null
                    }
                ]
            });
            appContextService.addAccessibleCenter({
                id: 3,
                label: 'germantown',
                name: 'Germantown',
                subjects: [
                    {
                        id: 1,
                        name: 'Reading and Writing',
                        levels: [
                            { id: 5, name: '1' },
                            { id: 6, name: '2' },
                            { id: 7, name: '3' },
                            { id: 8, name: '4' },
                            { id: 9, name: '5' },
                            { id: 10, name: '6' },
                            { id: 11, name: '7' },
                            { id: 12, name: '8' },
                            { id: 13, name: '9' },
                            { id: 14, name: '10' },
                            { id: 15, name: '11' },
                            { id: 16, name: '12' }
                        ],
                        hasBooks: true,
                        hasArticles: false,
                        dateFrom: null
                    },
                    {
                        id: 6,
                        name: 'Current Events',
                        levels: [
                            { id: 69, name: '2' },
                            { id: 70, name: '3-4' },
                            { id: 72, name: '5-6' },
                            { id: 73, name: '7-8' },
                            { id: 71, name: '9-12' }
                        ],
                        hasBooks: false,
                        hasArticles: true,
                        dateFrom: null
                    },
                    {
                        id: 2,
                        name: 'Math',
                        levels: [
                            { id: 20, name: '1' },
                            { id: 21, name: '2' },
                            { id: 22, name: '3' },
                            { id: 23, name: '4' },
                            { id: 24, name: '5' },
                            { id: 25, name: '6' },
                            { id: 26, name: '7' },
                            { id: 27, name: '8' },
                            { id: 28, name: '1A' },
                            { id: 29, name: '2A' },
                            { id: 30, name: '3A' },
                            { id: 31, name: '4A' },
                            { id: 32, name: '5A' },
                            { id: 33, name: '6A' },
                            { id: 34, name: '7A' },
                            { id: 35, name: '8A' },
                            { id: 111, name: 'K' },
                            { id: 64, name: '9' },
                            { id: 45, name: 'Algebra' },
                        ],
                        hasBooks: false,
                        hasArticles: false,
                        dateFrom: null
                    }
                ]
            });
            appContextService.setContext(Context.CENTERS);
            appContextService.setCenter(null);
            console.warn('APPLICATION STARTED WITHOUT AUTHORIZATION, USING DUMMY USER CONTEXT::');
            appContextService.printAppContext();
        }
    };
}
