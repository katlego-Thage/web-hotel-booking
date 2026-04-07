import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Room, RoomTypes, UserRole } from '../../../models';
import { Auth, RoomService } from '../../../services';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
})

export class RoomListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['roomNumber', 'roomType', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<Room>([]);
  isLoading = true;
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  typeFilter = '';
  statusFilter = '';
  roomTypes = RoomTypes;

  constructor(
    private roomService: RoomService,
    private authService: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRooms(): void {
    this.isLoading = true;
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.filteredRooms = rooms;
        this.dataSource.data = rooms;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load rooms: ' + error.message, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByType(): void {
    this.applyFilters();
  }

  filterByStatus(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.rooms];

    if (this.typeFilter) {
      filtered = filtered.filter(r => r.roomType === this.typeFilter);
    }

    if (this.statusFilter) {
      const isAvailable = this.statusFilter === 'available';
      filtered = filtered.filter(r => r.isAvailable === isAvailable);
    }

    this.filteredRooms = filtered;
    this.dataSource.data = filtered;
  }

  toggleAvailability(room: Room): void {
    const updatedRoom = { ...room, isAvailable: !room.isAvailable };
    this.roomService.updateRoom(room.roomID, updatedRoom as any).subscribe({
      next: () => {
        this.snackBar.open(
          `Room ${room.roomNumber} is now ${updatedRoom.isAvailable ? 'available' : 'occupied'}`,
          'Close',
          { duration: 3000 }
        );
        this.loadRooms();
      },
      error: (error) => {
        this.snackBar.open('Failed to update room: ' + error.message, 'Close', { duration: 5000 });
      }
    });
  }

  deleteRoom(room: Room): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Room',
        message: `Are you sure you want to delete Room ${room.roomNumber}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.deleteRoom(room.roomID).subscribe({
          next: () => {
            this.snackBar.open('Room deleted successfully', 'Close', { duration: 3000 });
            this.loadRooms();
          },
          error: (error) => {
            this.snackBar.open('Failed to delete room: ' + error.message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  // Permission checks
  get canCreate(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager]);
  }

  get canEdit(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager]);
  }

  get canDelete(): boolean {
    return this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager]);
  }
}

