import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

export interface SettingsData {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  onLiveChange?: (partial: Partial<SettingsData>) => void;
}

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatSlideToggleModule, MatSliderModule
  ],
  templateUrl: './settings-dialog.html',
  styleUrls: ['./settings-dialog.scss']
})
export class SettingsDialogComponent implements OnInit {

  musicControl = new FormControl<number>(0, { nonNullable: true });
  sfxControl = new FormControl<number>(0, { nonNullable: true });

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData
  ) { }

  ngOnInit() {
    // initialize form controls with incoming values
    this.musicControl.setValue(this.data.musicVolume ?? 0.8);
    this.sfxControl.setValue(this.data.sfxVolume ?? 0.8);

    // subscribe to changes so data updates live
    this.musicControl.valueChanges.subscribe(value => {
      this.data.musicVolume = value;
      this.updateMusicVolume();
    });

    this.sfxControl.valueChanges.subscribe(value => {
      this.data.sfxVolume = value;
      this.updateSfxVolume();
    });
  }

  updateMusicVolume() {
    console.log('Music volume:', this.data.musicVolume);
    this.data.onLiveChange?.({ musicVolume: this.data.musicVolume });
  }

  updateSfxVolume() {
    console.log('SFX volume:', this.data.sfxVolume);
    this.data.onLiveChange?.({ sfxVolume: this.data.sfxVolume });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
