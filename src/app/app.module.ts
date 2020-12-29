import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterseptorService } from './auth/auth-interceptor.service';

@NgModule({
    declarations: [AppComponent, HeaderComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterseptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
