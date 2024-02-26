package renewbuy.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.TimeZone;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.microsoft.playwright.Page;

import java.io.File;

public class Functions_wrapper {

	public String get_xpath(String xpath_name) throws IOException {

		FileInputStream input_stream = new FileInputStream(
				new File(System.getProperty("user.dir") + "/test_data/xpath.properties"));
		Properties pro = new Properties();
		pro.load(input_stream);
		return pro.getProperty(xpath_name);
	}

	public String get_test_data(String key_name) throws IOException {

		FileInputStream input_stream = new FileInputStream(
				new File(System.getProperty("user.dir") + "/test_data/data_file.properties"));
		Properties pro = new Properties();
		pro.load(input_stream);
		return pro.getProperty(key_name);
	}

	public Object[][] get_excel_data(String path, String excel_Name, String sheet_Name)
			throws IOException {
		File file = new File(path + "/" + excel_Name + ".xlsx");
		FileInputStream excel_File = new FileInputStream(file);
		XSSFWorkbook workbook = new XSSFWorkbook(excel_File);
		XSSFSheet sheet = workbook.getSheet(sheet_Name);
		int row_count = sheet.getPhysicalNumberOfRows();
		int col_count = sheet.getRow(0).getPhysicalNumberOfCells();
		Object obj_Data[][] = new Object[row_count - 1][col_count];
		try {

			for (int i = 1; i < row_count; i++) {
				for (int j = 0; j < sheet.getRow(i).getPhysicalNumberOfCells(); j++) {
					DataFormatter formatter = new DataFormatter();
					String cell_Data = formatter.formatCellValue(sheet.getRow(i).getCell(j));
					obj_Data[i - 1][j] = cell_Data;
				}
			}
			System.out.println(obj_Data.length);
		} catch (Exception e) {
			excel_File.close();
			workbook.close();
			return null;
		}
		excel_File.close();
		workbook.close();
		return obj_Data;
	}

	public String get_current_date_time() {
		SimpleDateFormat dateFormatreport = new SimpleDateFormat("dd-MM-yyyy-HH-mm-ss");
		dateFormatreport.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata"));
		String execution_time_report = dateFormatreport.format(new Date());
		// System.setProperty("current.date.time.report", execution_time_report);
		return execution_time_report;
	}

	public String create_folder_for_today_report(String current_execution_time) {
		String path = System.getProperty("user.dir") + "/reports/"
				+ current_execution_time+"/";
		File file = new File(path);
		if (!file.exists()) {
			System.out.println("Not  exist");
			file.mkdirs();
		} else {
			System.out.println("Folder exist");
		}

		return path;
	}

	public String take_screenshot(Page page,String file_name,String path){
		System.out.println("taking  screenshot");
		page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get(path+"/"+file_name+".png")));
		return path+"/"+file_name+".png";
	}

	

}
