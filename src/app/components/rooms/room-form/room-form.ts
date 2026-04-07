import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Room, RoomTypes, UpdateRoomRequest } from '../../../models';
import { RoomService } from '../../../services';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './room-form.html',
  styleUrl: './room-form.css',
})

export class RoomFormComponent implements OnInit {
  room: Partial<Room> = {
    roomNumber: '',
    roomType: '',
    pricePerNight: 0,
    isAvailable: true
  };
  
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  roomId: number | null = null;
  roomTypes = RoomTypes;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params['id'];
    if (this.roomId) {
      this.isEditMode = true;
      this.loadRoom(this.roomId);
    }
  }

  loadRoom(id: number): void {
    this.isLoading = true;
    this.roomService.getRoom(id).subscribe({
      next: (room) => {
        this.room = {
          roomID: room.roomID,
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          pricePerNight: room.pricePerNight,
          isAvailable: room.isAvailable
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load room: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/rooms']);
      }
    });
  }

  onSubmit(): void {
    if (!this.room.roomNumber || !this.room.roomType || this.room.pricePerNight === undefined) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.room.pricePerNight < 0) {
      this.snackBar.open('Price cannot be negative', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.roomId) {
      const updateData: UpdateRoomRequest = {
        roomID: this.roomId,
        roomNumber: this.room.roomNumber!,
        roomType: this.room.roomType!,
        pricePerNight: this.room.pricePerNight!,
        isAvailable: this.room.isAvailable!
      };

      this.roomService.updateRoom(this.roomId, updateData).subscribe({
        next: () => {
          this.snackBar.open('Room updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/rooms']);
        },
        error: (error) => {
          this.snackBar.open('Failed to update room: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    } else {
      const createData = {
        roomNumber: this.room.roomNumber!,
        roomType: this.room.roomType!,
        pricePerNight: this.room.pricePerNight!,
        isAvailable: this.room.isAvailable!
      };

      this.roomService.createRoom(createData).subscribe({
        next: () => {
          this.snackBar.open('Room created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/rooms']);
        },
        error: (error) => {
          this.snackBar.open('Failed to create room: ' + error.message, 'Close', { duration: 5000 });
          this.isSaving = false;
        }
      });
    }
  }
}

