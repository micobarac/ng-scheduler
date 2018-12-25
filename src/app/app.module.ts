import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { DateTimePickerComponent } from './datetime-picker/datetime-picker.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { InMemoryDataService } from './services/in-memory-data.service';

fontLibrary.add(faCalendar, faClock);

@NgModule({
  declarations: [AppComponent, SchedulerComponent, FormModalComponent, DateTimePickerComponent, ConfirmModalComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [FormModalComponent, ConfirmModalComponent]
})
export class AppModule {}
