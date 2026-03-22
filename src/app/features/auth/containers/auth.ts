import { Component } from '@angular/core';
import { WrapperCard } from "../../../shared/components/wrapper-card/wrapper-card";
import { Button } from "../../../shared/components/button/button";

@Component({
  selector: 'app-auth',
  imports: [WrapperCard, Button],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {

}
