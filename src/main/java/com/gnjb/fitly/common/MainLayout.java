package com.gnjb.fitly.common;

import javafx.scene.layout.BorderPane;
import javafx.scene.layout.Pane;
import javafx.stage.Stage;

public final class MainLayout {

	private static Stage primaryStage;
	private static BorderPane rootLayout;
	private static Pane modalLayout;
	
	public static Stage getPrimaryStage() {
		return primaryStage;
	}
	
	public static void setPrimaryStage(Stage primaryStage) {
		MainLayout.primaryStage = primaryStage;
	}
	
	public static BorderPane getRootLayout() {
		return rootLayout;
	}
	
	public static void setRootLayout(BorderPane rootLayout) {
		MainLayout.rootLayout = rootLayout;
	}

	public static Pane getModalLayout() {
		return modalLayout;
	}

	public static void setModalLayout(Pane modalLayout) {
		MainLayout.modalLayout = modalLayout;
	}
	
}
