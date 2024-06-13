import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";


@Injectable({
  providedIn: 'root'
})

export class SnackbarService {

  private readonly defaultDurationInSeconds = 5;

  constructor(private snackBar: MatSnackBar) {}

  private showMessage(
    message: string,
    panelClass: string,
    durationInSeconds: number = this.defaultDurationInSeconds
  ) {
    const config: MatSnackBarConfig = {
      panelClass: [panelClass],
      duration: durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };
    this.snackBar.open(message, undefined, config);
  }

  success(message: string, durationInSeconds?: number) {
    this.showMessage(message, 'snackbar-success', durationInSeconds);
  }

  info(message: string, durationInSeconds?: number) {
    this.showMessage(message, 'snackbar-info', durationInSeconds);
  }

  error(message: string, durationInSeconds?: number) {
    this.showMessage(message, 'snackbar-error', durationInSeconds);
  }

}
