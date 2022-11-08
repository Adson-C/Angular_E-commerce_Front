import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private oktAuthService: OktaAuthStateService, 
    @Inject(OKTA_AUTH) private OktaAuth: OktaAuth) { }

  ngOnInit(): void {

    // escrever um ama autenticação e mudanças
    this.oktAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    ); 


  }
  getUserDetails() {
    if (this.isAuthenticated) {
      
      // detalhes do (usuario )

      this.OktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;
        }
      );
    }
  }

  logout() {
    // encerrando a sessão e removendo token 
    this.OktaAuth.signOut();
  }


}
