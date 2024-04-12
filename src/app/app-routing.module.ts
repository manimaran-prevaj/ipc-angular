import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TempComponent } from './temp/temp-component';

const routes: Routes = [
	{
		path: 'new-customer',
		loadChildren: () => import('./new-customer/new-customer.module').then(m => m.NewCustomerModule)
	},
	// TODO:: Routes for remaining sidenav items
	{
		path: 'search-order',
		component: TempComponent
	},
	{
		path: 'feedback',
		component: TempComponent
	},
	{
		path: 'change-order-id',
		component: TempComponent
	},
	{
		path: 'verification',
		component: TempComponent
	},
	{
		path: '',
		redirectTo: '/new-customer',
		pathMatch: 'full'
	},
	// TODO:: Create a page not found to handle wild routes
	{
		path: '**',
		redirectTo: '/new-customer',
		pathMatch: 'full'
	},

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
