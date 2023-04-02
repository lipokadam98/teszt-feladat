export * from './chatRoomController.service';
import { ChatRoomControllerService } from './chatRoomController.service';
export * from './loginController.service';
import { LoginControllerService } from './loginController.service';
export * from './registrationController.service';
import { RegistrationControllerService } from './registrationController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [ChatRoomControllerService, LoginControllerService, RegistrationControllerService, UserControllerService];
