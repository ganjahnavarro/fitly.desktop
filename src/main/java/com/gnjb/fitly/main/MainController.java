package com.gnjb.fitly.main;

import java.io.IOException;

import com.gnjb.fitly.classes.UserManager;
import com.gnjb.fitly.classes.ViewController;
import com.gnjb.fitly.common.MainLayout;
import com.gnjb.fitly.config.user.UsersController;
import com.gnjb.fitly.model.user.User.Type;

import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.geometry.HPos;
import javafx.geometry.VPos;
import javafx.scene.control.Label;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.GridPane;

public class MainController extends ViewController{

	@FXML FlowPane box;
	
	@Override
	protected String getViewTitle() {
		return "Game Editor";
	}
	
	public void show(){
		try {
            FXMLLoader loader = new FXMLLoader();
            loader.setLocation(getClass().getResource("Main.fxml"));
            AnchorPane login = (AnchorPane) loader.load();
            MainLayout.getRootLayout().setCenter(login);
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
	
	@FXML
	public void initialize() {
		super.init();
		
		if(UserManager.getCurrentUser() != null){
			if(UserManager.getCurrentUser().getType().equals(Type.ADMIN)){
				createLauncher(0, "Users", "/images/rec_users.png", this::goToUsersPage);
			}
		}
		
	}
	
	private void createLauncher(Integer index, String name, String imagePath,
			EventHandler<? super MouseEvent> mouseClickHandler){
		GridPane launcherPane = new GridPane();
		ImageView launcherIcon = new ImageView(imagePath);
		Label launcherName = new Label(name);
		
		launcherPane.setOnMouseClicked(mouseClickHandler);
		launcherPane.getStyleClass().add("launcher-pane");
		
		GridPane.setHalignment(launcherName, HPos.CENTER);
		GridPane.setValignment(launcherName, VPos.CENTER);
		
		GridPane.setHalignment(launcherIcon, HPos.CENTER);
		GridPane.setValignment(launcherIcon, VPos.CENTER);
		
		launcherPane.addRow(0, launcherIcon);
		launcherPane.addRow(1, launcherName);
		
		box.getChildren().add(launcherPane);
	}
	
	private void goToUsersPage(MouseEvent event){
		new UsersController().show();
	}
	
}
