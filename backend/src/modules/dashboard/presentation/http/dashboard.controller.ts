import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from '../../application/services/dashboard.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('summary')
  async getDashboardSummary(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.dashboardService.getDashboardData(firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('income-vs-expense')
  async getIncomeVsExpense(@Request() req: any) {
    const firebaseUid = req.firebaseUid;
    return this.dashboardService.getIncomeVsExpenseDetail(firebaseUid);
  }

  // Development-only endpoint for testing
  @Get('test/summary')
  async getTestDashboardSummary() {
    const testFirebaseUid = 'test-user-001';
    return this.dashboardService.getDashboardData(testFirebaseUid);
  }
}
