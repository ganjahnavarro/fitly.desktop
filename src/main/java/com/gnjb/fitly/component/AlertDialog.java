package com.gnjb.fitly.component;

import javafx.scene.control.Alert;
import javafx.stage.Stage;

public class AlertDialog extends Alert {

	public AlertDialog(AlertType alertType, String title, String headerText, String content) {
		super(alertType);
		setTitle(title);
		setHeaderText(headerText);
		setContentText(content);
		getDialogPane().getStylesheets().add("/css/dialog.css");
	}

	public AlertDialog(AlertType alertType, String title, String headerText, String content, Stage stage) {
		super(alertType);
		initOwner(stage);
		setTitle(title);
		setHeaderText(headerText);
		setContentText(content);
		getDialogPane().getStylesheets().add("/css/dialog.css");
	}
	
}
