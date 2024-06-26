import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { AddEditUserComponent } from './features/users/components/add-edit-user/add-edit-user.component';

const routes: Routes = [
  { path: 'add-user', component: AddEditUserComponent },
  { path: 'users', component: UserListComponent },
  { path: '', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
