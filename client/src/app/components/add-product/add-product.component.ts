import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  product: Product = {
    prod_nom: '',
    id_prod_typ: '',
    prod_desc: '',
    precio: '',
    id_prod_cat: ''
  };
  submitted = false;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
    ) { }

  ngOnInit(): void {
  }

  saveProduct(): void {
    const data = {
      prod_nom: this.product.prod_nom,
      id_prod_typ: this.product.id_prod_typ,
      prod_desc: this.product.prod_desc,
      precio: this.product.precio,
      id_prod_cat: this.product.id_prod_cat
    };

    this.productService.create(data)
      .subscribe({
        next: (res) => {
          this.toastrService.success('Added successfully!','The '+ data.id_prod_typ +' '+ data.prod_nom + ' added successfully!');
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newProduct(): void {
    this.submitted = false;
    this.product = {
      prod_nom: '',
      id_prod_typ: '',
      prod_desc: '',
      precio: '',
      id_prod_cat: ''
    };
  }

}
