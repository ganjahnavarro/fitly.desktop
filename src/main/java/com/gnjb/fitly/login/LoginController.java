package com.gnjb.fitly.login;

import java.io.IOException;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.AnchorPane;

import com.gnjb.fitly.classes.UserManager;
import com.gnjb.fitly.classes.ViewController;
import com.gnjb.fitly.common.MainLayout;
import com.gnjb.fitly.component.AlertDialog;
import com.gnjb.fitly.main.MainController;
import com.gnjb.fitly.model.user.User;
import com.gnjb.fitly.model.user.UserDao;

public class LoginController extends ViewController{

	@FXML private TextField usernameField;
	@FXML private PasswordField passwordField;
	
	public void initialize(){
		super.init();
	}
	
	@Override
	protected String getViewTitle() {
		return null;
	}
	
	public void show(){
		try {
            FXMLLoader loader = new FXMLLoader();
            loader.setLocation(getClass().getResource("Login.fxml"));
            AnchorPane login = (AnchorPane) loader.load();
            MainLayout.getRootLayout().setCenter(login);
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
	
	@FXML
	private void login(){
		if(usernameField.getText().isEmpty() ||
			passwordField.getText().isEmpty()){
			new AlertDialog(AlertType.ERROR, "Ooops", "Username and/or password is required.", null).showAndWait();
		}else{
			UserDao userDao = new UserDao();
			User user = userDao.findActiveUser(usernameField.getText());
			
			if(user == null){
				new AlertDialog(AlertType.ERROR, "Ooops", "Invalid username or password. Please contact your administrator to reset your password.", null).showAndWait();
				return;
			}
			
			if(!user.getPassword().equals(passwordField.getText())){
				new AlertDialog(AlertType.ERROR, "Ooops", "Invalid username or password. Please contact your administrator to reset your password.", null).showAndWait();
				return;
			}
			
			UserManager.setCurrentUser(user);
			new MainController().show();
		}
	}
	
	@FXML
	private void exit(){
		MainLayout.getPrimaryStage().close();
	}
	
	@FXML
	private void handleForgotPassword(){
		super.close();
		new ChangePasswordController().show();
	}
}
