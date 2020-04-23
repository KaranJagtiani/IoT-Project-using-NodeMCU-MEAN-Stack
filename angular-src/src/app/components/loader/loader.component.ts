import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader-service/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
  }

}
