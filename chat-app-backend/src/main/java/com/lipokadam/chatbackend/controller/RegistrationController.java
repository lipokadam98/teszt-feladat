package com.lipokadam.chatbackend.controller;

import com.lipokadam.chatbackend.entity.User;
import com.lipokadam.chatbackend.entity.VerificationToken;
import com.lipokadam.chatbackend.event.RegistrationCompleteEvent;
import com.lipokadam.chatbackend.event.ResendTokenEvent;
import com.lipokadam.chatbackend.model.PasswordModel;
import com.lipokadam.chatbackend.model.UserModel;
import com.lipokadam.chatbackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
public class RegistrationController {

    private final UserService userService;

    private final ApplicationEventPublisher publisher;

    public RegistrationController(UserService userService, ApplicationEventPublisher publisher) {
        this.userService = userService;
        this.publisher = publisher;
    }

    @PostMapping("/register")
    public User register(@RequestBody UserModel userModel, final HttpServletRequest httpServletRequest) {
        var user = userService.registerUser(userModel);
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(httpServletRequest)));
        return user;
    }

    @GetMapping("/verifyRegistration")
    public String verifyRegistration(@RequestParam("token") String token){
       return userService.validateVerificationToken(token);
    }

    @GetMapping("/resendVerifyToken")
    public String resendVerificationToken(@RequestParam("token") String oldToken,
                                          HttpServletRequest request){
        VerificationToken verificationToken = userService.generateNewVerificationToken(oldToken);
        publisher.publishEvent(new ResendTokenEvent(verificationToken.getToken(), applicationUrl(request)));

        return "Verification link sent";

    }

    @PostMapping("/resetPassword")
    public String resetPassword(@RequestBody PasswordModel passwordModel,HttpServletRequest request){
        User user = userService.findUserByEmail(passwordModel.getEmail());
        String url= "";
        if(user != null){
            String token = UUID.randomUUID().toString();
            userService.createPasswordResetTokenForUser(user,token);
            url = passwordResetTokenMail(user,applicationUrl(request),token);
        }
        return "";
    }

    @PostMapping("savePassword")
    public String savePassword(@RequestParam("token") String token,
                               @RequestBody PasswordModel passwordModel){

        String result = userService.validatePasswordResetToken(token);

        if(!result.equalsIgnoreCase("valid")){
            return "Invalid Token";
        }

        Optional<User> user = userService.getUserByPasswordResetToken(token);

        if(user.isPresent()){
            userService.changePassword(user.get(),passwordModel.getNewPassword());
            return "Password reset successfully";
        }else{
            return "Invalid token";
        }
    }

    @PostMapping("/changePassword")
    public String changePassword(@RequestBody PasswordModel passwordModel){
        User user = userService.findUserByEmail(passwordModel.getEmail());

        if(!userService.checkIfValidOldPassword(user,passwordModel.getOldPassword())){
            return "Invalid Old Password";
        }

        //Save new password impl
        userService.changePassword(user,passwordModel.getNewPassword());

        return "Password changed successfully";

    }

    private String passwordResetTokenMail(User user, String applicationUrl, String token) {
        String url = applicationUrl+"/savePassword?token="+token;
        //Send Mail to user
        //sendVerificationEmail()
        log.info("Click the link to reset your password: {}"+url);
        return url;
    }

    @GetMapping("/")
    private String applicationUrl(HttpServletRequest httpServletRequest) {
        return "http://" +
                httpServletRequest.getServerName() +
                ":" +
                httpServletRequest.getServerPort() +
                httpServletRequest.getContextPath();
    }
}
