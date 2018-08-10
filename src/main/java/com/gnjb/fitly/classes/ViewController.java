package com.gnjb.fitly.classes;

import java.io.IOException;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.AnchorPane;

import com.gnjb.fitly.common.MainLayout;
import com.gnjb.fitly.login.LoginController;
import com.gnjb.fitly.main.MainController;
import com.gnjb.fitly.util.Logger;
import com.gnjb.fitly.util.Logger.Level;

public abstract class ViewController extends Controller {

	public enum Action {
		ADD, VIEW, EDIT, DELETE, ACTIVATE, ARCHIVE, RESTORE;
	}

	protected abstract String getViewTitle();

	private Label viewTitle;
	private Label currentLoggedUsername;
	private Button backToMainButton;
	private Button logoutButton;

	public ViewController() {

		viewTitle = ((Label) MainLayout.getPrimaryStage().getScene().lookup("#viewTitle"));

		currentLoggedUsername = ((Label) MainLayout.getPrimaryStage().getScene().lookup("#currentLoggedUser"));

		backToMainButton = ((Button) MainLayout.getPrimaryStage().getScene().lookup("#backToMainButton"));

		logoutButton = ((Button) MainLayout.getPrimaryStage().getScene().lookup("#logoutButton"));
	}

	public void init() {
		viewTitle.setText(getViewTitle());

		if (UserManager.getCurrentUser() == null) {
			currentLoggedUsername.setText("");
		} else {
			currentLoggedUsername.setText(UserManager.getCurrentUser().getFullName());
		}

		logoutButton.setOnAction(new EventHandler<ActionEvent>() {
			@Override
			public void handle(ActionEvent event) {
				UserManager.setCurrentUser(null);
				close();

				try {
					FXMLLoader loader = new FXMLLoader();
					loader.setLocation(LoginController.class.getResource("Login.fxml"));
					AnchorPane login = (AnchorPane) loader.load();
					MainLayout.getRootLayout().setCenter(login);
				} catch (IOException e) {
					Logger.log(getClass(), Level.ERROR, e.getMessage(), e);
				}
			}
		});

		backToMainButton.setOnAction(new EventHandler<ActionEvent>() {
			@Override
			public void handle(ActionEvent event) {
				close();

				try {
					FXMLLoader loader = new FXMLLoader();
					loader.setLocation(MainController.class.getResource("Main.fxml"));
					AnchorPane main = (AnchorPane) loader.load();
					MainLayout.getRootLayout().setCenter(main);
				} catch (IOException e) {
					Logger.log(getClass(), Level.ERROR, e.getMessage(), e);
				}
			}
		});

		if (UserManager.getCurrentUser() == null) {
			logoutButton.setVisible(false);
		} else {
			logoutButton.setVisible(true);
		}

		if (getClass() == MainController.class || getClass() == LoginController.class) {
			backToMainButton.setVisible(false);
		} else {
			backToMainButton.setVisible(true);
		}
	}

	protected void close() {
	}
}
